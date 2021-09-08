import { Listener } from './cmn-listener';
import { OrderCreatedEvent } from './order-created-event';
import { Subjects } from '../publishers/subjects';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { Message } from 'node-nats-streaming';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.tix.price,
      status: data.status,
      userId: data.userId,
      instance: data.instance,
    });
    await order.save();

    msg.ack();
  }
}
