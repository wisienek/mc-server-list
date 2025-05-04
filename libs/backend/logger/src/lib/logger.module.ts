import {Module, Global, Logger} from '@nestjs/common';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {LoggerHttpInterceptor} from './logger.interceptor';
import {SimpleLogger} from './simple-logger';

const pickedLogger = {
    provide: Logger,
    useClass: SimpleLogger,
};

@Global()
@Module({
    providers: [
        SimpleLogger,
        pickedLogger,
        {provide: APP_INTERCEPTOR, useClass: LoggerHttpInterceptor},
    ],
    exports: [pickedLogger],
})
export class LoggerModule {}
