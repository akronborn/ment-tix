import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '../../events/states/order-status';
import { app } from '../../app';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { Transaction } from '../../models/transaction';

it('returns 404 when attempting to pay for a non-existent order', async () => {
  await request(app)
    .post('/api/transactions')
    .set('Cookie', global.signin())
    .send({
      token: 'tok_visa',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns 401 when attempting to pay for an order not belonging to the active user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    instance: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/transactions')
    .set('Cookie', global.signin())
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    instance: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/transactions')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  const transaction = await Transaction.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(transaction).not.toBeNull();
});
