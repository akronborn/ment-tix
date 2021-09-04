import { Subjects } from '../publishers/subjects';
import { Listener } from './cmn-listener';
import { OrderCreatedEvent } from './order-created-event';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Tix } from '../../models/tix';
import { TixUpdatedPublisher } from '../publishers/tix-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //Find associated tix
    const tix = await Tix.findById(data.tix.id);
    //Throw error if tix not found
    if (!tix) {
      throw new Error('Tix not found');
    }
    //Reserve tix, assign orderId
    tix.set({ orderId: data.id });
    //Save tix
    await tix.save();
    await new TixUpdatedPublisher(this.client).publish({
      id: tix.id,
      instance: tix.instance,
      title: tix.title,
      content: tix.content,
      price: tix.price,
      userId: tix.userId,
      orderId: tix.orderId,
    });

    //ack order
    msg.ack();
  }
}
