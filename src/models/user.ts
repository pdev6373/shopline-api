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
  searchHistory?: ISearchHistory[];
  addresses?: IAddress[];
  socialMedia: ISocialMedia[];
  cart: ICart;
  bankAccounts: IBankAccount[];
  //
  accountDetails?: Types.ObjectId;
  pushNotifications: Types.ObjectId[];
  transactions: Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    profilePicture: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    membership: {
      type: String,
      enum: ['Regular', 'Silver', 'Gold'],
      default: 'Regular',
    },
    searchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SearchHistory',
      },
    ],
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Address',
      },
    ],
    socialMedia: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SocialMedia',
      },
    ],
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
    },
    bankAccounts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'BankAccount',
      },
    ],

    //
    // accountDetails: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Account',
    // },
    // pushNotifications: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'PushNotification',
    //   },
    // ],
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
