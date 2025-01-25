import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {BadRequestException, ValidationPipe} from '@nestjs/common';
import {WinstonModule} from 'nest-winston';
import {join} from 'node:path';
import {NestExpressApplication} from '@nestjs/platform-express';
import {AppModule} from './app.module';
import {winstonLoggerConfig} from './utils/logger';

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
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'authorization',
        )
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory(), {
        swaggerOptions: {
            apiTagsSorter: 'alpha',
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    });

    const assetsCoversFolder =
        (process.env.ASSETS_COVERS_FOLDER as string) ?? '/public/covers/';
    const assetsEpubFolder =
        (process.env.ASSETS_EPUB_FOLDER as string) ?? '/public/epub/';

    app.useStaticAssets(join(__dirname, '..', assetsCoversFolder), {
        prefix: assetsCoversFolder.replace('.', ''),
    });
    app.useStaticAssets(join(__dirname, '..', assetsEpubFolder), {
        prefix: assetsEpubFolder.replace('.', ''),
    });

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap().then();
