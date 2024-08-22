import mongoose, { Schema } from "mongoose";

export interface Details extends Document {
  address: string;
  devnet: number;
  testnet: number;
}

export interface Transactions extends Document {
  address: string;
  network: Network;
  amount: number;
  timeStamp: Date;
}

enum Network {
  devnet = "devnet",
  testnet = "testnet",
}

const transactionsSchema: Schema<Transactions> = new mongoose.Schema({
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  network: {
    type: String,
    required: [true, "Network is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  timeStamp: {
    type: Date,
    required: [true, "TimeStamp is required"],
  },
});

const DetailsSchema: Schema<Details> = new mongoose.Schema({
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  devnet: {
    type: Number,
    default: 0,
  },
  testnet: {
    type: Number,
    default: 0,
  },
});

export const DetailsModel =
  (mongoose.models.details as mongoose.Model<Details>) ||
  mongoose.model<Details>("details", DetailsSchema);

export const TransactionsModel =
  (mongoose.models.transactions as mongoose.Model<Transactions>) ||
  mongoose.model<Transactions>("transactions", transactionsSchema);
