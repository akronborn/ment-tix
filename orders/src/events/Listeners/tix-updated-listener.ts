import { Message } from 'node-nats-streaming';
import { Subjects } from '../publishers/subjects';
import { Listener } from './cmn-listener';
import { TixUpdatedEvent } from '../publishers/tix-updated-event';
import { Tix } from '../../models/tix';
import { queueGroupName } from './queue-group-name';

export class TixUpdatedListener extends Listener<TixUpdatedEvent> {
  subject: Subjects.TixUpdated = Subjects.TixUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TixUpdatedEvent['data'], msg: Message) {
    const tix = await Tix.findByConsult(data);

    if (!tix) {
      throw new Error('Tix not found');
    }

    const { title, content, price } = data;
    tix.set({ title, content, price });
    await tix.save();

    msg.ack();
  }
}
