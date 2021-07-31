import request from 'supertest';
import { app } from '../../app';
import { Tix } from '../../models/tix';

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
      body: 'description',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tix')
    .set('Cookie', global.signin())
    .send({
      body: 'description',
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
      body: 'description',
    })
    .expect(400);

  await request(app)
    .post('/api/tix')
    .set('Cookie', global.signin())
    .send({
      title: 'Sample Title',
      body: 'sample body',
      price: -1,
    })
    .expect(400);
});

it('ticket created when all inputs are valid ', async () => {
  let tix = await Tix.find({});
  expect(tix.length).toEqual(0);

  await request(app)
    .post('/api/tix')
    .set('Cookie', global.signin())
    .send({
      title: 'Sample Title 2',
      body: 'Description',
      price: 20.0,
    })
    .expect(201);

  tix = await Tix.find({});
  expect(tix.length).toEqual(1);
});
