import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TixUpdatedEvent } from '../../publishers/tix-updated-event';
import { TixUpdatedListener } from '../tix-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Tix } from '../../../models/tix';

const setup = async () => {
  // Create a listener
  const listener = new TixUpdatedListener(natsWrapper.client);

  // Create and save a tix
  const tix = Tix.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Session',
    content: 'Description',
    price: 20,
  });
  await tix.save();

  // Create a fake data object
  const data: TixUpdatedEvent['data'] = {
    id: tix.id,
    instance: tix.instance + 1,
    title: 'new concert',
    content: 'Early entry',
    price: 123,
    userId: 'abcd',
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, tix, listener };
};

it('finds, updates, and saves tix', async () => {
  const { msg, data, tix, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTix = await Tix.findById(tix.id);

  expect(updatedTix!.title).toEqual(data.title);
  expect(updatedTix!.content).toEqual(data.content);
  expect(updatedTix!.price).toEqual(data.price);
  expect(updatedTix!.instance).toEqual(data.instance);
});

it('acks the message', async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('Ack not called if instance not next to be processed', async () => {
  const { msg, data, listener, tix } = await setup();

  data.instance = 15;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
