import mongoose from 'mongoose';
import { Order } from './order';
import { OrderStatus } from '../middleware/states/order-status';

interface TixAttrs {
  title: string;
  content: string;
  price: number;
}

export interface TixDoc extends mongoose.Document {
  title: string;
  content: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TixModel extends mongoose.Model<TixDoc> {
  build(attrs: TixAttrs): TixDoc;
}

const tixSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

tixSchema.statics.build = (attrs: TixAttrs) => {
  return new Tix(attrs);
};

tixSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    tix: this as any,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.PendingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Tix = mongoose.model<TixDoc, TixModel>('Tix', tixSchema);

export { Tix };
