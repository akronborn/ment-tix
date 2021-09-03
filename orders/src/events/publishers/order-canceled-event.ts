import { Subjects } from './subjects';

export interface OrderCanceledEvent {
  subject: Subjects.OrderCanceled;
  data: {
    id: string;
    instance: number;
    tix: {
      id: string;
    };
  };
}
