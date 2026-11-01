import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { OrderController } from './order.controller';
import { PrismaOrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
    imports: [AuthModule, ProductModule],
    controllers: [OrderController],
    providers: [
        OrderService,
        { provide: 'IOrderRepository', useClass: PrismaOrderRepository },
    ],
})
export class OrderModule {}
