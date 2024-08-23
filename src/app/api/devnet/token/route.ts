import { DBconnection } from "@/lib/db";
import { DetailsModel, TransactionsModel } from "@/model/Schema";
import { transfer } from "@/utils/transfer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await DBconnection();
    const { amount, address } = await req.json();
    console.log(amount, address);

    const TOKEN_LIMIT = 20000;

    const details = await DetailsModel.findOne({ address: address });

    if (details) {
      const alreadyTakenAmount = details.amount;

      if (alreadyTakenAmount == TOKEN_LIMIT) {
        return NextResponse.json(
          {
            message: "You have already taken the maximum amount",
          },
          { status: 403 }
        );
      } else if (alreadyTakenAmount + amount > TOKEN_LIMIT) {
        const diff = TOKEN_LIMIT - alreadyTakenAmount;
        return NextResponse.json(
          {
            message: "Total requested amount is more than the limit",
            diff,
          },
          { status: 403 }
        );
      } else {
        console.log("Account already there");
        // tranfer tokens
        await transfer(address, amount, "devnet");

        console.log("Before update - Current amount:", details.amount);
        details.amount = details.amount + amount;
        console.log("After update - Current amount:", details.amount);

        await details.save();
        console.log("Details saved");

        const newTransaction = new TransactionsModel({
          address: address,
          amount: amount,
          timeStamp: new Date(),
        });
        await newTransaction.save();

        console.log("Transations saved");

        return NextResponse.json(
          {
            message: "Devnet tokens airdropped successfully",
          },
          { status: 200 }
        );
      }
    } else {
      console.log("Account not there");

      // tranfer tokens
      await transfer(address, amount, "devnet");

      const newDetails = new DetailsModel({
        address: address,
        amount: amount,
      });
      await newDetails.save();

      const newTransaction = new TransactionsModel({
        address: address,
        amount: amount,
        timeStamp: new Date(),
      });
      await newTransaction.save();

      return NextResponse.json(
        {
          message: "Devnet tokens airdropped successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
