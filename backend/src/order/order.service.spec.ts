import { BadRequestException } from '@nestjs/common';
import { calculateShippingFee } from './order.service';

describe('calculateShippingFee', () => {
    it('uses the default fee when no coordinates are available', () => {
        expect(calculateShippingFee()).toBe(30_000);
    });

    it('calculates the local fee at the configured warehouse', () => {
        expect(calculateShippingFee(10.7769, 106.7009)).toBe(15_000);
    });

    it('uses the correct tier for IUH Go Vap coordinates', () => {
        expect(calculateShippingFee(10.8220, 106.6877)).toBe(25_000);
    });

    it('rejects incomplete coordinate pairs', () => {
        expect(() => calculateShippingFee(10.8220)).toThrow(BadRequestException);
    });
});
