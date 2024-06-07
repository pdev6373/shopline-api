import { model, Schema } from 'mongoose';
import { IUser } from './user';

export interface ISearchHistory extends Document {
  userId: IUser;
  searchQuery: string;
  searchDate: Date;
}

const searchHistorySchema = new Schema<ISearchHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    searchQuery: {
      type: String,
      required: true,
      trim: true,
    },
    searchDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default model<ISearchHistory>('SearchHistory', searchHistorySchema);
