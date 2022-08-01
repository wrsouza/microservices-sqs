import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './app/products/products.module';
import * as Joi from 'joi';
import { MailModule } from './infra/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        AWS_CLIENT_ID: Joi.string().required(),
        AWS_CLIENT_SECRET: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_SQS_QUEUE_URL: Joi.string().required(),
      }),
    }),
    MailModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
