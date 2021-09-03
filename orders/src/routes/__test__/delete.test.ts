import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Tix } from '../../models/tix';
import { Order } from '../../models/order';
import { OrderStatus } from '../../middleware/states/order-status';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
  // create tix with Tix Model
  const tix = Tix.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Session',
    content: 'description',
    price: 30,
  });
  await tix.save();

  const user = global.signin();
  // create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ tixId: tix.id })
    .expect(201);

  // cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // make sure the order is canceled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it('emits an order canceled event', async () => {
  const tix = Tix.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Session',
    content: 'description',
    price: 30,
  });
  await tix.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ tixId: tix.id })
    .expect(201);

  // cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
