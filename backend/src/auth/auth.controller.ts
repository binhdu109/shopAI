import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Đăng nhập và nhận access token JWT' })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('register')
    @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }
}
