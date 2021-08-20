import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '../../middleware/states/order-status';
import { Tix } from '../../models/tix';
import { natsWrapper } from '../../nats-wrapper';

it('returns error if tix does not exist', async () => {
  const tixId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ tixId })
    .expect(404);
});

it('returns error if tix already reserved', async () => {
  const tix = Tix.build({
    title: 'mentorship',
    content: 'description',
    price: 20,
  });
  await tix.save();
  const order = Order.build({
    tix,
    userId: 'uniqueuser',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ tixId: tix.id })
    .expect(400);
});

it('reserves tix', async () => {
  const tix = Tix.build({
    title: 'mentorship',
    content: 'description',
    price: 45,
  });
  await tix.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ tixId: tix.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const tix = Tix.build({
    title: 'mentorship',
    content: 'description',
    price: 45,
  });
  await tix.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ tixId: tix.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
