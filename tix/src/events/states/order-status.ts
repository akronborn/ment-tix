export enum OrderStatus {
  //When order created, tix not reserved
  Created = 'created',

  //When in order process, the desired tix is already reserved, order is canceled, or tix reservation expired
  Canceled = 'canceled',

  //When tix reserved and awaiting payment
  PendingPayment = 'pending:payment',

  //When tix reserved and payment is successfully remitted
  Complete = 'complete',
}
