import { Subjects } from './subjects';
import { Publisher } from './cmn-publisher';
import { OrderCanceledEvent } from './order-canceled-event';

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
}
