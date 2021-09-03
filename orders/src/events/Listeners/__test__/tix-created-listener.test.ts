import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TixCreatedEvent } from '../../publishers/tix-created-event';
import { TixCreatedListener } from '../tix-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Tix } from '../../../models/tix';

const setup = async () => {
  // create listener intsance
  const listener = new TixCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TixCreatedEvent['data'] = {
    instance: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Vid chat',
    content: 'Lets meet today',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves tix', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a tix was created!
  const tix = await Tix.findById(data.id);

  expect(tix).toBeDefined();
  expect(tix!.title).toEqual(data.title);
  expect(tix!.content).toEqual(data.content);
  expect(tix!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { data, listener, msg } = await setup();
  // call the onMessage function with the data object + message object

  await listener.onMessage(data, msg);
  // Ensure ack function is called

  expect(msg.ack).toHaveBeenCalled();
});
