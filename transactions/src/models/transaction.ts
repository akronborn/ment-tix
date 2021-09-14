import mongoose from 'mongoose';

interface TransactionAttrs {
  orderId: string;
  stripeId: string;
}

interface TransactionDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc;
}

const transactionSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String,
    },
    stripeId: {
      required: true,
      type: String,
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

transactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction(attrs);
};

const Transaction = mongoose.model<TransactionDoc, TransactionModel>(
  'Transaction',
  transactionSchema
);

export { Transaction };
