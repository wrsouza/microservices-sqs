import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventHandlers } from './events';
import { ProductsController } from './products.controller';

@Module({
  imports: [CqrsModule],
  controllers: [ProductsController],
  providers: [...EventHandlers],
})
export class ProductsModule {}
