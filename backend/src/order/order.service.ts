import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ProductService } from '../product/product.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderInput, IOrderRepository } from './order.repository';

const WAREHOUSE = { latitude: 10.7769, longitude: 106.7009 };
const SHIPPING_TIERS = [
    { maxKm: 5, fee: 15_000 },
    { maxKm: 20, fee: 25_000 },
    { maxKm: 100, fee: 40_000 },
    { maxKm: Infinity, fee: 60_000 },
];

export function calculateShippingFee(latitude?: number, longitude?: number) {
    if (latitude === undefined && longitude === undefined) return 30_000;
    if (latitude === undefined || longitude === undefined) {
        throw new BadRequestException('Cần gửi đủ cả latitude và longitude');
    }

    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const dLat = toRadians(latitude - WAREHOUSE.latitude);
    const dLon = toRadians(longitude - WAREHOUSE.longitude);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(WAREHOUSE.latitude)) *
            Math.cos(toRadians(latitude)) *
            Math.sin(dLon / 2) ** 2;
    const distanceKm = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return SHIPPING_TIERS.find((tier) => distanceKm <= tier.maxKm)!.fee;
}

@Injectable()
export class OrderService {
    constructor(
        private readonly productService: ProductService,
        @Inject('IOrderRepository') private readonly orderRepository: IOrderRepository,
    ) {}

    async createOrder(dto: CreateOrderDto, userId: string) {
        const items: CreateOrderInput['items'] = [];
        let subtotal = 0;

        for (const item of dto.items) {
            if (!Number.isInteger(item.quantity)) {
                throw new BadRequestException('Số lượng sản phẩm phải là số nguyên');
            }
            const product = await this.productService.findRawById(item.productId);
            if (!product) {
                throw new BadRequestException(`Sản phẩm ${item.productId} không còn tồn tại`);
            }
            subtotal += product.price * item.quantity;
            items.push({
                productId: product.id,
                productName: product.name,
                image: product.image,
                category: product.category,
                quantity: item.quantity,
                price: product.price,
            });
        }

        const shippingFee = calculateShippingFee(dto.latitude, dto.longitude);
        const total = subtotal + shippingFee;
        if (total !== dto.total) {
            throw new BadRequestException(
                `Tổng tiền không khớp. Server tính ${total}, Client gửi ${dto.total}. Vui lòng tải lại giỏ hàng.`,
            );
        }

        return this.orderRepository.save({
            id: `ORD-${Date.now()}-${randomUUID().slice(0, 8)}`,
            userId,
            subtotal,
            shippingFee,
            total,
            items,
        });
    }

    getOrdersForUser(userId: string) {
        return this.orderRepository.findByUserId(userId);
    }

    async getOrderForUser(orderId: string, userId: string) {
        const order = await this.orderRepository.findById(orderId);
        if (!order || order.userId !== userId) {
            throw new NotFoundException('Không tìm thấy hóa đơn');
        }
        return order;
    }

    async payOrder(orderId: string, userId: string) {
        const order = await this.getOrderForUser(orderId, userId);
        if (order.status === 'PAID') return order;
        if (order.status !== 'PENDING') {
            throw new BadRequestException(`Không thể thanh toán đơn ở trạng thái ${order.status}`);
        }
        return this.orderRepository.updateStatus(orderId, 'PAID');
    }
}
