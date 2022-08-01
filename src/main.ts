import { MicroserviceOptions } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AwsSqsServer } from './infra/transporters/sqsTransportStrategy';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      strategy: new AwsSqsServer(),
    },
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.listen();
}
bootstrap();
