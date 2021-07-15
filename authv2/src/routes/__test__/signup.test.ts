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

it('returns status 400 after request email validation failure', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'invalidemail.com',
      password: 'password',
    })
    .expect(400);
});
