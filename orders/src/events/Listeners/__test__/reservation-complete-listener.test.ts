import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderStatus } from '../../../middleware/states/order-status';
import { ReservationCompleteEvent } from '../reservation-complete-event';
import { ReservationCompleteListener } from '../reservation-complete-listener';

import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';
import { Tix } from '../../../models/tix';

const setup = async () => {
  const listener = new ReservationCompleteListener(natsWrapper.client);

  const tix = Tix.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Questions',
    content: 'Tuesday',
    price: 411,
  });
  await tix.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'random',
    expiresAt: new Date(),
    tix,
  });
  await order.save();

  const data: ReservationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, tix, data, msg };
};

it('Sets order status set to Canceled', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it('Emits an OrderCanceled event', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it('Will ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
