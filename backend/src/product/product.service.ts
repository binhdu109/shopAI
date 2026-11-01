import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) {}

    getAllProducts() {
        return this.prisma.product.findMany({ orderBy: { id: 'asc' } });
    }

    async getProductById(id: string) {
        const product = await this.findRawById(id);
        if (!product) {
            throw new NotFoundException(`Không tìm thấy sản phẩm có id = ${id}`);
        }
        return product;
    }

    findRawById(id: string) {
        return this.prisma.product.findUnique({ where: { id } });
    }
}
