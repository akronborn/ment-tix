import request from 'supertest';
import { app } from '../../app';

const createTix = () => {
  return request(app).post('/api/tix').set('Cookie', global.signin()).send({
    title: 'Dominate',
    content: 'Be better',
    price: 10,
  });
};

it('can fetch a list of tix', async () => {
  await createTix();
  await createTix();
  await createTix();

  const response = await request(app).get('/api/tix').send().expect(200);

  expect(response.body.length).toEqual(3);
});
