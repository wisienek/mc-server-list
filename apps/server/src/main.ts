import {ClassSerializerInterceptor, Logger, ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {NestFactory, Reflector} from '@nestjs/core';
import {SimpleLogger} from '@backend/logger';
import {ApiConfig} from '@backend/config';
import {AppModule} from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: SimpleLogger.create('bootstrap'),
    });

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.enableShutdownHooks();

    const configService = app.get(ApiConfig);

    const options = new DocumentBuilder()
        .setTitle('McList Api')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        })
        .addApiKey({
            type: 'apiKey',
            description: 'API key used for app authorization',
            in: 'header',
            name: 'x-mc-list-api-key',
        })
        .build();
    const document = SwaggerModule.createDocument(app, options, {
        include: [AppModule],
        deepScanRoutes: true,
        autoTagControllers: true,
    });
    SwaggerModule.setup('docs', app, document, {explorer: true});

    const port = configService.APP_PORT;
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
}

bootstrap();
