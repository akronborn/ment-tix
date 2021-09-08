import { OrderCanceledEvent } from './order-canceled-event';
import { Subjects } from '../publishers/subjects';
import { Listener } from './cmn-listener';
import { OrderStatus } from '../states/order-status';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCanceledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      instance: data.instance - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Canceled });
    await order.save();

    msg.ack();
  }
}
