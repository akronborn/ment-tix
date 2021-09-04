import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCanceledEvent } from '../order-canceled-event';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCanceledListener } from '../order-canceled-listener';
import { Tix } from '../../../models/tix';

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const tix = Tix.build({
    title: 'Consult',
    content: 'Day 1',
    price: 20,
    userId: 'asdf',
  });
  tix.set({ orderId });
  await tix.save();

  const data: OrderCanceledEvent['data'] = {
    id: orderId,
    instance: 0,
    tix: {
      id: tix.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, tix, orderId, listener };
};

it('updates tix, publishes an event, & acks the message', async () => {
  const { msg, data, tix, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTix = await Tix.findById(tix.id);
  expect(updatedTix!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
