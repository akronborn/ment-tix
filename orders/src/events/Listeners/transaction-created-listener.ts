import { Subjects } from '../publishers/subjects';
import { Listener } from './cmn-listener';
import { OrderStatus } from '../../middleware/states/order-status';
import { TransactionCreatedEvent } from './transaction-created-event';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class TransactionCreatedListener extends Listener<TransactionCreatedEvent> {
  readonly subject = Subjects.TransactionCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order Not Found');
    }
    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
