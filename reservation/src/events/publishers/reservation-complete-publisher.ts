import { Publisher } from './cmn-publisher';
import { Subjects } from '../listeners/subjects';
import { ReservationCompleteEvent } from './reservation-complete-event';

export class ReservationCompletePublisher extends Publisher<ReservationCompleteEvent> {
  readonly subject = Subjects.ReservationComplete;
}
