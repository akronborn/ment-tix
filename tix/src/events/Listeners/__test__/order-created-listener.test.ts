import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent } from '../order-created-event';
import { OrderStatus } from '../../states/order-status';
import { natsWrapper } from '../../../nats-wrapper';
import { Tix } from '../../../models/tix';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  //Create listener instance
  const listener = new OrderCreatedListener(natsWrapper.client);

  //create tix
  const tix = Tix.build({
    title: 'New Sess',
    content: 'Arrive early',
    price: 50,
    userId: 'abcd',
  });

  await tix.save();

  //create data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    instance: 0,
    status: OrderStatus.Created,
    userId: 'abcd',
    expiresAt: 'placeholder',
    tix: {
      id: tix.id,
      price: tix.price,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, tix, data, msg };
};

it('set tix userId', async () => {
  const { listener, tix, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTix = await Tix.findById(tix.id);

  expect(updatedTix!.orderId).toEqual(data.id);
});

it('acks the message event', async () => {
  const { listener, tix, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes updated tix event', async () => {
  const { listener, tix, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const updatedTixData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(updatedTixData.orderId);
});
