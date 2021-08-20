import { Publisher } from './cmn-publisher';
import { Subjects } from './subjects';
import { TixUpdatedEvent } from './tix-updated-event';

export class TixUpdatedPublisher extends Publisher<TixUpdatedEvent> {
  readonly subject = Subjects.TixUpdated;
}
