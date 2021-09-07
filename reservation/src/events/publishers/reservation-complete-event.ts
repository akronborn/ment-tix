import { Subjects } from '../listeners/subjects';

export interface ReservationCompleteEvent {
  subject: Subjects.ReservationComplete;
  data: {
    orderId: string;
  };
}
