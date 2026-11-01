import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

type AuthenticatedRequest = Request & { user: { userId: string; email: string } };

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    create(@Body() dto: CreateOrderDto, @Req() request: AuthenticatedRequest) {
        return this.orderService.createOrder(dto, request.user.userId);
    }

    @Get()
    findMine(@Req() request: AuthenticatedRequest) {
        return this.orderService.getOrdersForUser(request.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
        return this.orderService.getOrderForUser(id, request.user.userId);
    }

    @Post(':id/pay')
    pay(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
        return this.orderService.payOrder(id, request.user.userId);
    }
}
