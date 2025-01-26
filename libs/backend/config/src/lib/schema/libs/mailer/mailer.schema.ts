import { Injectable } from '@nestjs/common';
import { Config } from 'nest-zod-config';
import { z } from 'zod';

export const MailerSchema = z.object({
  SMTP_HOST: z.string().url(`SMT host has to be an url`),
  SMTP_PORT: z.coerce.number().min(1).max(6000),
  SMTP_USER: z.string().min(8, `User has to be at least 8 characters long`),
  SMTP_PASSWORD: z.string().min(8, `Password is too short`),
  SMTP_MAILDEV_WEB_IP: z.string(),
  SMTP_MAILDEV_WEB_PORT: z.coerce.number(),
});

@Injectable()
export class MailerConfig extends Config(MailerSchema) {}
