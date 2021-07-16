import request from 'supertest';
import { app } from '../../app';

it('returns status 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest@email.com',
      password: 'password1',
    })
    .expect(201);
});

it('returns status 400 after empty email and password submission', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: '',
      password: '',
    })
    .expect(400);
});

it('returns status 400 after request email validation failure', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'invalidemail.com',
      password: 'password',
    })
    .expect(400);
});

it('returns status 400 after request password validation failure', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'validemail2@email.com',
      password: 'pass1',
    })
    .expect(400);
});

it('Returns status 400 failed request due to duplicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest@email.com',
      password: 'password1',
    })
    .expect(201);

  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest@email.com',
      password: 'password1',
    })
    .expect(400);
});
