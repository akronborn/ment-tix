import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Tix } from '../../models/tix';

const buildTix = async () => {
  const tix = Tix.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    content: 'description',
    price: 60,
  });
  await tix.save();

  return tix;
};

it('fetches orders for an particular user', async () => {
  // Create three tixs
  const tixOne = await buildTix();
  const tixTwo = await buildTix();
  const tixThree = await buildTix();

  const userOne = global.signin();
  const userTwo = global.signin();
  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ tixId: tixOne.id })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ tixId: tixTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ tixId: tixThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].tix.id).toEqual(tixTwo.id);
  expect(response.body[1].tix.id).toEqual(tixThree.id);
});
