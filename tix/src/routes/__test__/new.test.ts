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

it('error thrown when title is invalid ', async () => {});

it('error thrown when price is invalid ', async () => {});

it('ticket created when all inputs are valid ', async () => {});
