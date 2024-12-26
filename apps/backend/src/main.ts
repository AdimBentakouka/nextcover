import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors) => new BadRequestException(errors),
            validationError: {
                target: false,
                value: false,
            },
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('NextCover API')
        .setDescription('Documentation for NextCover API')
        .setVersion('1.0')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory());

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap().then();
