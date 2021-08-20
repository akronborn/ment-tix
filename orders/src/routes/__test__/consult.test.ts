import request from 'supertest';
import { app } from '../../app';
import { Tix } from '../../models/tix';

it('fetches the order', async () => {
  // Create tix
  const tix = Tix.build({
    title: 'concert',
    content: 'new description',
    price: 20,
  });
  await tix.save();

  const user = global.signin();
  // build an order with created tix
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ tixId: tix.id })
    .expect(201);

  //  fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  // Create a tix
  const tix = Tix.build({
    title: 'concert',
    content: 'description',
    price: 70,
  });
  await tix.save();

  const user = global.signin();
  // build an order with created tix
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ tixId: tix.id })
    .expect(201);

  // fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
