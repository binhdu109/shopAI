import { z } from 'zod';

export const ProductSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Tên sản phẩm không được để trống'),
    price: z.number().positive('Giá sản phẩm phải lớn hơn 0'),
    image: z.string().url('Đường dẫn ảnh phải là URL hợp lệ'),
    category: z.string().optional(),
});

export const ProductListSchema = z.array(ProductSchema);
export type Product = z.infer<typeof ProductSchema>;