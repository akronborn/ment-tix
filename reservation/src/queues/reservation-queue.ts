import Queue from 'bull';

interface Payload {
  orderId: string;
}

const reservationQueue = new Queue<Payload>('order:reservation', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

reservationQueue.process(async (job) => {
  console.log(
    'job: Publish an reservation: complete event for OrderId',
    job.data.orderId
  );
});

export { reservationQueue };
