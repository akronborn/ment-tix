import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order } from './order';
import { OrderStatus } from '../middleware/states/order-status';

interface TixAttrs {
  id: string;
  title: string;
  content: string;
  price: number;
}

export interface TixDoc extends mongoose.Document {
  instance: number;
  title: string;
  content: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TixModel extends mongoose.Model<TixDoc> {
  build(attrs: TixAttrs): TixDoc;
  findByConsult(consult: {
    id: string;
    instance: number;
  }): Promise<TixDoc | null>;
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

tixSchema.set('versionKey', 'instance');
tixSchema.plugin(updateIfCurrentPlugin);

tixSchema.statics.findByConsult = (consult: {
  id: string;
  instance: number;
}) => {
  return Tix.findOne({
    _id: consult.id,
    instance: consult.instance - 1,
  });
};

tixSchema.statics.build = (attrs: TixAttrs) => {
  return new Tix({
    _id: attrs.id,
    title: attrs.title,
    content: attrs.content,
    price: attrs.price,
  });
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
