import { Subjects } from '../publishers/subjects';

export interface ReservationCompleteEvent {
  subject: Subjects.ReservationComplete;
  data: {
    orderId: string;
  };
}
