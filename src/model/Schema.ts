import mongoose, { Schema } from "mongoose";

export interface Details extends Document {
  address: string;
  amount: number;
}

export interface Transactions extends Document {
  address: string;
  amount: number;
  timeStamp: Date;
}

const transactionsSchema: Schema<Transactions> = new mongoose.Schema({
  address: {
    type: String,
    required: [true, "Address is required"],
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
  amount: {
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
