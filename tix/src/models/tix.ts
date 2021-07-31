import mongoose from 'mongoose';

interface TixAttrs {
  title: string;
  body: string;
  price: number;
  userId: string;
}

interface TixDoc extends mongoose.Document {
  title: number;
  body: string;
  price: number;
  userId: string;
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
    body: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
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

const Tix = mongoose.model<TixDoc, TixModel>('Tix', tixSchema);

export { Tix };
