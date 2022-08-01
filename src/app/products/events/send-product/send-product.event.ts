import { ProductDto } from '../../dtos';

export class SendProductEvent {
  constructor(public readonly productDto: ProductDto) {}
}
