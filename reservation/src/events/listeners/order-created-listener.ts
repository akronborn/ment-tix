import { Listener } from './cmn-listener';
import { OrderCreatedEvent } from './order-created-event';
import { Subjects } from './subjects';
import { queueGroupName } from './queue-group-name';
import { reservationQueue } from '../../queues/reservation-queue';
import { Message } from 'node-nats-streaming';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('How long til job is processed in milliseconds:', delay);

    await reservationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
    msg.ack();
  }
}
