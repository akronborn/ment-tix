import { Subjects } from './subjects';
import { OrderStatus } from '../../middleware/states/order-status';

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    instance: number;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    tix: {
      id: string;
      price: number;
    };
  };
}
