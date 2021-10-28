import { Message } from 'node-nats-streaming';
import { Subjects } from '../publishers/subjects';
import { Listener } from './cmn-listener';
import { ReservationCompleteEvent } from './reservation-complete-event';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderStatus } from '../../middleware/states/order-status';
import { OrderCanceledPublisher } from '../publishers/order-canceled-publisher';

export class ReservationCompleteListener extends Listener<ReservationCompleteEvent> {
  readonly subject = Subjects.ReservationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ReservationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('tix');

    if (!order) {
      throw new Error('Order Not Found');
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Canceled,
    });
    await order.save();
    await new OrderCanceledPublisher(this.client).publish({
      id: order.id,
      instance: order.instance,
      tix: {
        id: order.tix.id,
      },
    });
    msg.ack();
  }
}
