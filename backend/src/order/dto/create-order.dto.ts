import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';

export class OrderItemDto {
    @IsString()
    productId!: string;

    @IsNumber()
    @Min(1, { message: 'Số lượng tối thiểu là 1' })
    quantity!: number;
}

export class CreateOrderDto {
    @IsArray()
    @ArrayNotEmpty({ message: 'Giỏ hàng đang trống, không thể đặt hàng' })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[];

    @IsNumber()
    @Min(0)
    total!: number;

    @IsOptional()
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude?: number;

    @IsOptional()
    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude?: number;
}
