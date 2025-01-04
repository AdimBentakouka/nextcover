import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {BadRequestException, ValidationPipe} from '@nestjs/common';
import {WinstonModule} from 'nest-winston';
import {winstonLoggerConfig} from './utils/logger';
import {join} from 'node:path';
import {NestExpressApplication} from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        // Utilisation de Winston pour le logging principal
        logger: WinstonModule.createLogger({
            instance: winstonLoggerConfig,
        }),
    });

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

    app.useStaticAssets(join(__dirname, '..', process.env.COVER_FOLDER), {
        prefix: '/assets/cover/', // URL de base pour accéder aux fichiers
    });

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap().then();
