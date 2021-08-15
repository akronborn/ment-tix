import mongoose from 'mongoose';

interface TixAttrs {
  title: string;
  price: number;
}

export interface TixDoc extends mongoose.Document {
  title: string;
  price: number;
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

const Tix = mongoose.model<TixDoc, TixModel>('Tix', tixSchema);

export { Tix };
