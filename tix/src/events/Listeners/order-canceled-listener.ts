import { Listener } from './cmn-listener';
import { OrderCanceledEvent } from './order-canceled-event';
import { Subjects } from '../publishers/subjects';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Tix } from '../../models/tix';
import { TixUpdatedPublisher } from '../publishers/tix-updated-publisher';

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCanceledEvent['data'], msg: Message) {
    const tix = await Tix.findById(data.tix.id);

    if (!tix) {
      throw new Error('Tix not found');
    }

    tix.set({ orderId: undefined });
    await tix.save();
    await new TixUpdatedPublisher(this.client).publish({
      id: tix.id,
      orderId: tix.orderId,
      userId: tix.userId,
      content: tix.content,
      price: tix.price,
      title: tix.title,
      instance: tix.instance,
    });

    msg.ack();
  }
}
