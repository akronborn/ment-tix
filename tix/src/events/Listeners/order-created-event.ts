import { Subjects } from '../publishers/subjects';
import { OrderStatus } from '../states/order-status';

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
