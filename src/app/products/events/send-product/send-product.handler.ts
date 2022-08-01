import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SendProductEvent } from './send-product.event';

@EventsHandler(SendProductEvent)
export class SendProductHandler implements IEventHandler<SendProductEvent> {
  constructor(private mailer: MailerService) {}

  async handle({ productDto }: SendProductEvent): Promise<void> {
    Logger.log(`SendProductHandler: ${JSON.stringify(productDto)}`);
    try {
      const mailOptionsDto: ISendMailOptions = {
        from: 'admin@domain.com',
        to: ['user1@domain.com'],
        subject: `Created: ${productDto.name}`,
        text: `Product: ${productDto.name} (${productDto.id}) with sku: ${productDto.sku} and price: ${productDto.price}`,
        html: `
          <p><strong>Id: ${productDto.id}</strong></p>
          <p><strong>Name:</strong> ${productDto.name}</p>
          <p><strong>Sku:</strong> ${productDto.sku}</p>
          <p><strong>Price:</strong> ${productDto.price}</p>
          <p><strong>Created At:</strong> ${productDto.createdAt}</p>
        `,
      };
      const info = await this.mailer.sendMail(mailOptionsDto);
      Logger.log(`Email Sent Id: ${info.messageId}`);
    } catch (err) {
      Logger.log(
        `Send Product: ${productDto.id} with Error: ${JSON.stringify(err)}`,
      );
      throw err;
    }
  }
}
