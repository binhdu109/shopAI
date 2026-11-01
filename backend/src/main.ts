import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.use(helmet());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const swaggerConfig = new DocumentBuilder()
        .setTitle('ShopAI API')
        .setDescription('Backend API cho ứng dụng ShopAI')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swaggerConfig));

    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port, '0.0.0.0');
}

bootstrap().catch((error: unknown) => {
    console.error('ShopAI backend failed to start:', error);
    process.exitCode = 1;
});
