import request from 'supertest';
import { app } from '../../app';

it('has post request route handler listening', async () => {
  const response = await request(app).post('/api/tix').send({});

  expect(response.status).not.toEqual(404);
});

it('Should not return status 401 for logged in user ', async () => {
  const response = await request(app)
    .post('/api/tix')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('user must be logged in to access page ', async () => {
  await request(app).post('/api/tix').send({}).expect(401);
});

it('error thrown when title is invalid ', async () => {
  await request(app)
    .post('/api/tix')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tix')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('error thrown when price is invalid ', async () => {
  await request(app)
    .post('/api/tix')
    .set('Cookie', global.signin())
    .send({
      title: 'Sample Title',
    })
    .expect(400);

  await request(app)
    .post('/api/tix')
    .set('Cookie', global.signin())
    .send({
      title: 'Sample Title',
      price: -1,
    })
    .expect(400);
});

it('ticket created when all inputs are valid ', async () => {
  await request(app)
    .post('/api/tix')
    .send({
      title: 'Sample Title 2',
      price: 20.0,
    })

    .expect(201);
});
