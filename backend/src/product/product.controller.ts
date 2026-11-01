import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('api/products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    getProducts() {
        return this.productService.getAllProducts();
    }

    @Post()
    @ApiOperation({ summary: 'Minh họa ValidationPipe với DTO sản phẩm' })
    validateProduct(@Body() dto: CreateProductDto) {
        return { message: 'Dữ liệu hợp lệ, đã nhận sản phẩm', data: dto };
    }

    @Get(':id')
    getProductById(@Param('id') id: string) {
        return this.productService.getProductById(id);
    }
}
