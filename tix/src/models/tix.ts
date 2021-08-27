import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TixAttrs {
  title: string;
  content: string;
  price: number;
  userId: string;
}

interface TixDoc extends mongoose.Document {
  title: string;
  content: string;
  price: number;
  userId: string;
  instance: number;
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

tixSchema.set('versionKey', 'instance');
tixSchema.plugin(updateIfCurrentPlugin);

tixSchema.statics.build = (attrs: TixAttrs) => {
  return new Tix(attrs);
};

const Tix = mongoose.model<TixDoc, TixModel>('Tix', tixSchema);

export { Tix };
