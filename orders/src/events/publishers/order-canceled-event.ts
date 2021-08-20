import { Subjects } from './subjects';

export interface OrderCanceledEvent {
  subject: Subjects.OrderCanceled;
  data: {
    id: string;
    tix: {
      id: string;
    };
  };
}
