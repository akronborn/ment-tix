import { app } from './app';
import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/Listeners/order-created-listener';
import { OrderCanceledListener } from './events/Listeners/order-canceled-listener';

const startDB = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('Keys must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is undefined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID is undefined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID is undefined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL is undefined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('Nats connection closed');
      process.exit();
    });

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCanceledListener(natsWrapper.client).listen();

    await mongoose.connect(`${process.env.MONGO_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Tix database connection established');
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

startDB();
