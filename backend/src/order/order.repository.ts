import { Injectable } from '@nestjs/common';
import { Order, OrderItem, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const includeItems = { items: true } satisfies Prisma.OrderInclude;
export type OrderWithItems = Order & { items: OrderItem[] };

export interface CreateOrderInput {
    id: string;
    userId: string;
    subtotal: number;
    shippingFee: number;
    total: number;
    items: {
        productId: string;
        productName: string;
        image: string;
        category: string;
        quantity: number;
        price: number;
    }[];
}

export interface IOrderRepository {
    save(input: CreateOrderInput): Promise<OrderWithItems>;
    findByUserId(userId: string): Promise<OrderWithItems[]>;
    findById(orderId: string): Promise<OrderWithItems | null>;
    updateStatus(orderId: string, status: string): Promise<OrderWithItems>;
}

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
    constructor(private readonly prisma: PrismaService) {}

    save(input: CreateOrderInput) {
        return this.prisma.order.create({
            data: {
                id: input.id,
                userId: input.userId,
                subtotal: input.subtotal,
                shippingFee: input.shippingFee,
                total: input.total,
                status: 'PENDING',
                items: { create: input.items },
            },
            include: includeItems,
        });
    }

    findByUserId(userId: string) {
        return this.prisma.order.findMany({
            where: { userId },
            include: includeItems,
            orderBy: { createdAt: 'desc' },
        });
    }

    findById(orderId: string) {
        return this.prisma.order.findUnique({ where: { id: orderId }, include: includeItems });
    }

    updateStatus(orderId: string, status: string) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: includeItems,
        });
    }
}
