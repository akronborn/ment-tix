import request from 'supertest';
import { app } from '../../app';
import { Tix } from '../../models/tix';

it('returns 404 error if ticket is not found', async () => {
  await request(app).get('/api/tix/pseudoid').send().expect(404);
});

it('returns the tix if ticket is found', async () => {
  const title = 'Sample Title';
  const content = 'Sample content';
  const price = 30;

  const response = await request(app)
    .post('/api/tix')
    .set('Cookie', global.signin())
    .send({
      title,
      content,
      price,
    })
    .expect(201);

  const tixResponse = await request(app)
    .get(`/api/tix/${response.body.id}`)
    .send()
    .expect(200);

  expect(tixResponse.body.title).toEqual(title);
  expect(tixResponse.body.content).toEqual(content);
  expect(tixResponse.body.price).toEqual(price);
});
