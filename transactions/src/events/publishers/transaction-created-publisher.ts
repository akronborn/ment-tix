import { Subjects } from './subjects';
import { Publisher } from './cmn-publisher';
import { TransactionCreatedEvent } from './transaction-created-event';

export class TransactionCreatedPublisher extends Publisher<TransactionCreatedEvent> {
  readonly subject = Subjects.TransactionCreated;
}
