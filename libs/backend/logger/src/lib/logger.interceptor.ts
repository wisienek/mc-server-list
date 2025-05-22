import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import type {Request} from 'express';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {SimpleLogger} from './simple-logger';

@Injectable()
export class LoggerHttpInterceptor implements NestInterceptor {
    constructor(private readonly logger: SimpleLogger) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request & {session?: any; user?: any}>();

        const ip =
            request.headers['x-forwarded-for'] || request.socket.remoteAddress;
        const sessionId = request.session?.id || null;
        const userAgent = request.headers['user-agent'] || '';

        const discordUser = request.user;

        const discordId = discordUser?.discordId ?? null;
        const discordTag = discordUser?.discordTag ?? null;
        const username = discordUser?.username ?? null;
        const email = discordUser?.email ?? null;

        this.logger.context.set('ip', ip);
        this.logger.context.set('sessionId', sessionId);
        this.logger.context.set('userAgent', userAgent);
        this.logger.context.set('discordId', discordId);
        this.logger.context.set('discordTag', discordTag);
        this.logger.context.set('username', username);
        this.logger.context.set('email', email);

        return next.handle().pipe(
            tap(() => {
                this.logger.context.delete('ip');
                this.logger.context.delete('sessionId');
                this.logger.context.delete('userAgent');
                this.logger.context.delete('discordId');
                this.logger.context.delete('discordTag');
                this.logger.context.delete('username');
                this.logger.context.delete('email');
            }),
        );
    }
}
