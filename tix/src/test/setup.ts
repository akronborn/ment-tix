import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => Promise<string>;
}

let mongod: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'randomando';
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongod.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  //JWT Payload {id, emmail}
  const payload = {
    id: '23fd83lk3',
    email: 'gblmail@test.com',
  };
  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //Build session object {jwt: MY_JWT}
  const session = { jwt: token };
  //Turn session object into JSON
  const sessionJSON = JSON.stringify(session);
  //encode JSON as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  //return encoded data as string
  return `express:sess=${base64}`;
};
