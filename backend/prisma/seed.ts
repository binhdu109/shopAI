import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import products from '../src/product/products.json';

const prisma = new PrismaClient();

async function main() {
    for (const product of products) {
        await prisma.product.upsert({
            where: { id: product.id },
            update: {
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
            },
            create: product,
        });
    }

    const demoEmail = process.env.DEMO_USER_EMAIL;
    const demoPassword = process.env.DEMO_USER_PASSWORD;
    if (demoEmail && demoPassword) {
        const password = await bcrypt.hash(demoPassword, 10);
        await prisma.user.upsert({
            where: { email: demoEmail },
            update: {},
            create: { email: demoEmail, password, name: 'Học viên Demo' },
        });
    }

    console.log(`Seeded ${products.length} products.`);
}

main()
    .catch((error: unknown) => {
        console.error('Database seed failed:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
