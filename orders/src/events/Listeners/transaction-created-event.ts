import { Subjects } from '../publishers/subjects';

export interface TransactionCreatedEvent {
  readonly subject: Subjects.TransactionCreated;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}
