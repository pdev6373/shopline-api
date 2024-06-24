import { model, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'caregiver' | 'admin';
  subRoles: string[];
  firstName: string;
  lastName: string;
  ageGroup: string;
  organizationName: string;
  address: string;
  city: string;
  zipcode: string;
  country: string;
  isEmailOrPhoneVerified?: boolean;
  isIdentityVerified?: boolean;
  membership?: 'starter' | 'basic' | 'premium' | 'vip'; // To be removed, revenue cart should be used in the mobile app

  // searchHistoryIds?: ISearchHistory[];
  // addressIds?: IAddress[];
  // socialMediaIds: ISocialMedia[];
  // cartId: ICart;
  // bankAccountIds: IBankAccount[];
  // onlineStatus: boolean;
  // //
  // accountDetails?: Types.ObjectId;
  // transactions: Types.ObjectId[];
  // profilePicture
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['customer', 'caregiver', 'admin'],
    },
    subRoles: { type: [String], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    ageGroup: { type: String, required: true },
    organizationName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipcode: { type: String, required: true },
    country: { type: String, required: true },
    isEmailOrPhoneVerified: { type: Boolean, default: false },
    isIdentityVerified: { type: Boolean, default: false },
    membership: {
      type: String,
      enum: ['starter', 'basic', 'premium', 'vip'],
      default: 'starter',
    },

    //

    // searchHistoryIds: [{ type: Schema.Types.ObjectId, ref: 'SearchHistory' }],
    // addressIds: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    // socialMediaIds: [{ type: Schema.Types.ObjectId, ref: 'SocialMedia' }],
    // cartId: { type: Schema.Types.ObjectId, ref: 'Cart' },
    // bankAccountIds: [{ type: Schema.Types.ObjectId, ref: 'BankAccount' }],
    // //
    // onlineStatus: { type: Boolean, default: false },

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
