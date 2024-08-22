import { DBconnection } from "@/lib/db";
import { TransactionsModel } from "@/model/Schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await DBconnection();
    const { address } = await req.json();
    const transactions = await TransactionsModel.find({ address: address });

    if (transactions.length > 0) {
      return NextResponse.json(
        {
          message: "Transactions fetched successfully",
          transactions: transactions,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No transactions found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
