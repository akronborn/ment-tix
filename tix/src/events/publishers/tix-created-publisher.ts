import { Publisher } from './cmn-publisher';
import { Subjects } from './subjects';
import { TixCreatedEvent } from './tix-created-event';

export class TixCreatedPublisher extends Publisher<TixCreatedEvent> {
  readonly subject = Subjects.TixCreated;
}
