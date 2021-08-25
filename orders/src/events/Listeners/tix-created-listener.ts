import { Message } from 'node-nats-streaming';
import { Subjects } from '../publishers/subjects';
import { Listener } from './cmn-listener';
import { TixCreatedEvent } from '../publishers/tix-created-event';
import { Tix } from '../../models/tix';
import { queueGroupName } from './queue-group-name';

export class TixCreatedListener extends Listener<TixCreatedEvent> {
  readonly subject = Subjects.TixCreated;
  queueGroupName = queueGroupName;

  //Message object from Nats has ack() property, called when event successfully processed

  async onMessage(data: TixCreatedEvent['data'], msg: Message) {
    const { id, content, title, price } = data;

    const ticket = Tix.build({
      id,
      content,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
