import { Controller } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { EventPattern } from '@nestjs/microservices';
import { ProductDto } from './dtos';
import { SendProductEvent } from './events';

@Controller()
export class ProductsController {
  constructor(private readonly eventBus: EventBus) {}

  @EventPattern('main')
  async handleEvent(data: any) {
    const productDto: ProductDto = JSON.parse(data.Body);
    const event = new SendProductEvent(productDto);
    await this.eventBus.publish(event);
  }
}
