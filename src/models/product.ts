import { model, Schema, Document } from 'mongoose';
import { IReview } from './review';
import { IDiscussion } from './discussion';

export interface IProduct extends Document {
  images: string[];
  name: string;
  price: number;
  description: string;
  quantity: number;
  numberAvailable: number;
  numberOfPurchases: number;
  reviewIds: IReview[];
  discussionIds: IDiscussion[];
  // Shouldn't some of them be numbers
  cashback: boolean;
  freeShipping: boolean;
  discount: boolean;
  wholesalePrice: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    images: [{ type: String, required: true }],
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    numberAvailable: { type: Number, required: true, default: 0 },
    numberOfPurchases: { type: Number, required: true, default: 0 },
    reviewIds: [{ type: Schema.Types.ObjectId, ref: 'Review', required: true }],
    discussionIds: [
      { type: Schema.Types.ObjectId, ref: 'Discussion', required: true },
    ],
    // Shouldn't some of them be numbers
    cashback: { type: Boolean, default: false },
    freeShipping: { type: Boolean, default: false },
    discount: { type: Boolean, default: false },
    wholesalePrice: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    discriminatorKey: 'category',
  },
);

// export interface IShoeProduct extends IProduct {
//   size: 5 | 5.5 | 6 | 6.5 | 7 | 7.5 | 8 | 8.5 | 9 | 9.5;
// }

// const shoeProductSchema = new Schema<IShoeProduct>(
//   {
//     size: {
//       type: Number,
//       enum: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5],
//       default: 7,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

export interface ISportsProduct extends IProduct {
  size: 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL';
}

const sportsProductSchema = new Schema<ISportsProduct>(
  {
    size: {
      type: String,
      enum: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      default: 'M',
    },
  },
  {
    timestamps: true,
  },
);

export interface IElectronicsProduct extends IProduct {
  colors: string[];
  memory: string[];
  storage: string[];
}

const electronicsProductSchema = new Schema<IElectronicsProduct>(
  {
    colors: [
      {
        type: String,
        required: true,
      },
    ],
    memory: [
      {
        type: String,
        required: true,
      },
    ],
    storage: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export interface IAutomotiveProduct extends IProduct {
  type: string;
  colors: string[];
}

const automotiveProductSchema = new Schema<IAutomotiveProduct>(
  {
    type: {
      type: String,
      required: true,
    },
    colors: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// export interface IClothingProduct extends IProduct {
//   size: string;
//   color: string;
// }

// // Schema for clothing products
// const clothingProductSchema = new Schema<IClothingProduct>(
//   {
//     size: {
//       type: String,
//       required: true,
//     },
//     color: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

const Product = model<IProduct>('Product', productSchema);

const SportsProduct = Product.discriminator<ISportsProduct>(
  'Sports',
  sportsProductSchema,
);

const ElectronicsProduct = Product.discriminator<IElectronicsProduct>(
  'Electronics',
  electronicsProductSchema,
);

const AutomotiveProduct = Product.discriminator<IAutomotiveProduct>(
  'Automotive',
  automotiveProductSchema,
);

// const ClothingProduct = Product.discriminator<IClothingProduct>(
//   'Clothing',
//   clothingProductSchema,
// );

export {
  Product,
  SportsProduct,
  ElectronicsProduct,
  AutomotiveProduct,
  // ClothingProduct,
};
