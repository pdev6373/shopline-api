import { model, Schema, Types } from 'mongoose';
import { IAddress } from './address';
import { ISearchHistory } from './searchHistory';
import { ISocialMedia } from './socialMedia';
import { ICart } from './cart';
import { IBankAccount } from './bankAccount';

export interface IUser extends Document {
  email: string;
  firstname: string;
  lastname: string;
  profilePicture?: string;
  password: string;
  pin?: string;
  phoneNumber?: string;
  isVerified: boolean;
  membership: 'Regular' | 'Silver' | 'Gold';
  searchHistoryIds?: ISearchHistory[];
  addressIds?: IAddress[];
  socialMediaIds: ISocialMedia[];
  cartId: ICart;
  bankAccountIds: IBankAccount[];
  onlineStatus: boolean;
  //
  accountDetails?: Types.ObjectId;
  transactions: Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, trim: true, unique: true },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    profilePicture: { type: String },
    password: { type: String, required: true },
    pin: { type: String },
    phoneNumber: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    membership: {
      type: String,
      enum: ['Regular', 'Silver', 'Gold'],
      default: 'Regular',
    },
    searchHistoryIds: [{ type: Schema.Types.ObjectId, ref: 'SearchHistory' }],
    addressIds: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    socialMediaIds: [{ type: Schema.Types.ObjectId, ref: 'SocialMedia' }],
    cartId: { type: Schema.Types.ObjectId, ref: 'Cart' },
    bankAccountIds: [{ type: Schema.Types.ObjectId, ref: 'BankAccount' }],
    //
    onlineStatus: { type: Boolean, default: false },

    //
    // accountDetails: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Account',
    // },
    // transactions: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Transaction',
    //   },
    // ],
    // wallet: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Wallet',
    // },

    // benefit: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Benefit',
    // },
    // vouchers: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Voucher',
    // },
    // followedStore: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Following',
    // },
    // notification: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Notification',
    // },
    // wishlist: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Wishlist',
    // },
    // chat: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Chat',
    // },
    // orders: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Order',
    // },
  },
  {
    timestamps: true,
  },
);

export default model<IUser>('User', userSchema);
