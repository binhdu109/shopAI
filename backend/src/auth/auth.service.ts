import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    private async issueToken(user: { id: string; email: string; name: string | null }) {
        return {
            accessToken: await this.jwtService.signAsync({ sub: user.id, email: user.email }),
            user: { id: user.id, email: user.email, name: user.name },
        };
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.trim().toLowerCase() },
        });
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }
        return this.issueToken(user);
    }

    async register(dto: RegisterDto) {
        const email = dto.email.trim().toLowerCase();
        const password = await bcrypt.hash(dto.password, 10);
        try {
            const user = await this.prisma.user.create({
                data: { email, password, name: dto.name?.trim() || null },
                select: { id: true, email: true, name: true },
            });
            return this.issueToken(user);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException('Email đã được đăng ký');
            }
            throw error;
        }
    }
}
