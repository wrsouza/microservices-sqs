import { Server, CustomTransportStrategy } from '@nestjs/microservices';
import { Consumer } from 'sqs-consumer';
import * as AWS from 'aws-sdk';
import { Logger } from '@nestjs/common';

export class AwsSqsServer extends Server implements CustomTransportStrategy {
  constructor() {
    super();
    AWS.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_CLIENT_ID,
      secretAccessKey: process.env.AWS_CLIENT_SECRET,
    });
  }

  listen(callback: (...optionalParams: unknown[]) => any) {
    const app = Consumer.create({
      queueUrl: process.env.AWS_SQS_QUEUE_URL,
      handleMessage: async (message) => {
        const handlers = this.messageHandlers;
        const handler = handlers.get('main');

        if (handler) {
          try {
            await handler(message);
          } catch (e) {
            throw e;
          }
        } else {
          console.warn(`No handler registered for the event`);
        }
      },
      sqs: new AWS.SQS(),
    });

    app.on('error', (err) => {
      Logger.error(`Error with queue`, {
        queue: process.env.AWS_SQS_QUEUE_URL,
        error: err.message,
      });
    });

    app.on('processing_error', (err) => {
      Logger.error(err.message);
    });

    app.on('timeout_error', (err) => {
      Logger.error(err.message);
    });

    app.on('message_received', () => {
      Logger.log('Message Received.');
    });

    app.on('message_processed', () => {
      Logger.log('Message Processed.');
    });

    app.start();

    callback();
  }

  close() {
    Logger.warn('Closing AWS SQS SERVER');
  }
}
