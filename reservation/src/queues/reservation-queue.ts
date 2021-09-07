import Queue from 'bull';
import { ReservationCompletePublisher } from '../events/publishers/reservation-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  orderId: string;
}

const reservationQueue = new Queue<Payload>('order:reservation', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

reservationQueue.process(async (job) => {
  new ReservationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { reservationQueue };
