const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { PrismaClient } = require('@prisma/client');

const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const envText = fs.readFileSync(envPath, 'utf8');
    const databaseUrl = envText.match(/^DATABASE_URL=(.*)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '');
    if (databaseUrl) process.env.DATABASE_URL ??= databaseUrl;
}

const baseUrl = process.env.SHOPAI_API_URL ?? 'http://127.0.0.1:3000';
const prisma = new PrismaClient();
const testEmail = `smoke-${Date.now()}@shopai.test`;
const secondTestEmail = `smoke-other-${Date.now()}@shopai.test`;
const testEmails = [testEmail, secondTestEmail];

async function request(path, options) {
    return fetch(new URL(path, baseUrl), options);
}

async function main() {
    const health = await request('/api/health');
    assert.equal(health.status, 200);
    const healthResult = await health.json();
    assert.equal(healthResult.status, 'ok');
    assert.ok(Number.isFinite(Date.parse(healthResult.timestamp)));

    const productsResponse = await request('/api/products');
    assert.equal(productsResponse.status, 200);
    const products = await productsResponse.json();
    assert.equal(products.length, 67);

    const productResponse = await request(`/api/products/${products[0].id}`);
    assert.equal(productResponse.status, 200);
    assert.equal((await productResponse.json()).id, products[0].id);

    const missingProduct = await request('/api/products/missing-smoke-product');
    assert.equal(missingProduct.status, 404);

    const invalidDto = await request('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '', price: -1, image: 'not-a-url' }),
    });
    assert.equal(invalidDto.status, 400);

    const unauthenticatedOrders = await request('/api/orders');
    assert.equal(unauthenticatedOrders.status, 401);

    const registration = await request('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: testEmail,
            password: 'test-password-123',
            name: 'ShopAI smoke test',
        }),
    });
    assert.equal(registration.status, 201);
    const { accessToken } = await registration.json();
    assert.ok(accessToken);

    const login = await request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: 'test-password-123' }),
    });
    assert.equal(login.status, 200);
    assert.ok((await login.json()).accessToken);

    const invalidLogin = await request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: 'wrong-password' }),
    });
    assert.equal(invalidLogin.status, 401);

    const duplicateRegistration = await request('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: 'test-password-123' }),
    });
    assert.equal(duplicateRegistration.status, 409);

    const product = products[0];
    const createOrder = async (total, quantity = 1) =>
        request('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                items: [{ productId: product.id, quantity }],
                latitude: 10.7769,
                longitude: 106.7009,
                total,
            }),
        });

    const invalidOrder = await createOrder(product.price + 15_000, -1);
    assert.equal(invalidOrder.status, 400);

    const tamperedTotal = await createOrder(1);
    assert.equal(tamperedTotal.status, 400);

    const createdResponse = await createOrder(product.price + 15_000);
    assert.equal(createdResponse.status, 201);
    const createdOrder = await createdResponse.json();
    assert.equal(createdOrder.status, 'PENDING');
    assert.equal(createdOrder.subtotal, product.price);
    assert.equal(createdOrder.shippingFee, 15_000);

    const secondRegistration = await request('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: secondTestEmail, password: 'test-password-123' }),
    });
    assert.equal(secondRegistration.status, 201);
    const { accessToken: secondAccessToken } = await secondRegistration.json();
    const otherUserOrder = await request(`/api/orders/${createdOrder.id}`, {
        headers: { Authorization: `Bearer ${secondAccessToken}` },
    });
    assert.equal(otherUserOrder.status, 404);

    const ordersResponse = await request('/api/orders', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    assert.equal(ordersResponse.status, 200);
    assert.ok((await ordersResponse.json()).some((order) => order.id === createdOrder.id));

    const detailResponse = await request(`/api/orders/${createdOrder.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    assert.equal(detailResponse.status, 200);

    const paymentResponse = await request(`/api/orders/${createdOrder.id}/pay`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    assert.equal(paymentResponse.status, 201);
    assert.equal((await paymentResponse.json()).status, 'PAID');

    const duplicatePaymentResponse = await request(`/api/orders/${createdOrder.id}/pay`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    assert.equal((await duplicatePaymentResponse.json()).status, 'PAID');

    console.log('PASS: health, catalog, DTO validation, registration/login, JWT ownership, pricing, and payment.');
}

main()
    .catch((error) => {
        console.error('ShopAI API smoke test failed:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        for (const email of testEmails) {
            const user = await prisma.user.findUnique({
                where: { email },
                select: { id: true },
            });
            if (!user) continue;
            const orders = await prisma.order.findMany({
                where: { userId: user.id },
                select: { id: true },
            });
            const orderIds = orders.map((order) => order.id);
            if (orderIds.length) {
                await prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
                await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
            }
            await prisma.user.delete({ where: { id: user.id } });
        }
        await prisma.$disconnect();
    });
