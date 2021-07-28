import { app } from './app';
import mongoose from 'mongoose';

const startDB = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('Keys must be defined');
  }
  if (!process.env.JWT_KEY) {
    throw new Error('MONGO_URI is undefined');
  }

  try {
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
