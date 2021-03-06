import request from 'supertest';
import { app } from '../../app';
import { Tix } from '../../models/tix';
import mongoose from 'mongoose';

import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tix/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Meetup',
      content: "Let's meetup",
      price: 20,
    })
    .expect(404);
});

it('returns 401 if user not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tix/${id}`)
    .send({
      title: 'Meetup',
      instance: 0,
      content: "Let's meetup",
      price: 20,
    })
    .expect(401);
});

it('returns 401 if user not owner of tix', async () => {
  const response = await request(app)
    .post('/api/tix')
    .set('Cookie', global.signin())
    .send({
      title: 'a title',
      content: 'some content',
      price: 50,
    });

  await request(app)
    .put(`/api/tix/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'new title',
      content: 'new content',
      price: 60,
    })
    .expect(401);

  expect(response.body.title).toEqual('a title');
  expect(response.body.content).toEqual('some content');
  expect(response.body.price).toEqual(50);
});

it('returns 400 if invalid title, content, or price provided', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tix')
    .set('Cookie', cookie)
    .send({
      title: 'a title',
      content: 'some content',
      price: 50,
    });

  await request(app)
    .put(`/api/tix/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      content: 'Description',
      price: 44,
    })
    .expect(400);

  await request(app)
    .put(`/api/tix/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'This title',
      price: 44,
    })
    .expect(400);

  await request(app)
    .put(`/api/tix/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'This title',
      content: 'Description',
      price: -5,
    })
    .expect(400);
});

it('tix updated when valid inputs provided', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tix')
    .set('Cookie', cookie)
    .send({
      title: 'a title',
      content: 'some content',
      price: 50,
    });

  await request(app)
    .put(`/api/tix/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Valid title',
      content: 'Valid content',
      price: 0,
    })
    .expect(200);

  const tixResponse = await request(app)
    .get(`/api/tix/${response.body.id}`)
    .send();

  expect(tixResponse.body.title).toEqual('Valid title');
  expect(tixResponse.body.content).toEqual('Valid content');
  expect(tixResponse.body.price).toEqual(0);
});

it('successfully publishes an event', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tix')
    .set('Cookie', cookie)
    .send({
      title: 'a title',
      content: 'some content',
      price: 22,
    });

  await request(app)
    .put(`/api/tix/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Valid title',
      content: 'Valid content',
      price: 33,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('Does not permit editing of reserved tix', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tix')
    .set('Cookie', cookie)
    .send({
      title: 'Consultation',
      content: 'Review',
      price: 44,
    });

  const tix = await Tix.findById(response.body.id);
  tix!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await tix!.save();

  await request(app)
    .put(`/api/tix/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'New Consultation',
      content: 'New review',
      price: 444,
    })
    .expect(400);
});
