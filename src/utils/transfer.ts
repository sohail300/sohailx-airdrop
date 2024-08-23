import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  Cluster,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";
import { NextResponse } from "next/server";

export async function transfer(to: string, amount: number, network: Cluster) {
  try {
    const conn = new Connection(clusterApiUrl(network), "confirmed");
    const transaction = new Transaction();

    const ToPublicKey = new PublicKey(to);
    const secret = Uint8Array.from(
      JSON.parse(process.env.SOLANA_KEYPAIR!) || "[]"
    );
    const from = Keypair.fromSecretKey(secret);

    let ata = await getAssociatedTokenAddress(
      new PublicKey(process.env.TOKEN_MINT!), // mint
      ToPublicKey // reciever address
    );
    console.log(`ata: ${ata.toBase58()}`);

    const accountInfo = await conn.getAccountInfo(ata);

    if (!accountInfo) {
      console.log("Creating new Associated Token Account");

      const createAta = createAssociatedTokenAccountInstruction(
        from.publicKey, // payer
        ata, // ata
        ToPublicKey, // owner
        new PublicKey(process.env.TOKEN_MINT!) // mint
      );
      transaction.add(createAta);
    }

    const mintInfo = await getMint(
      conn,
      new PublicKey(process.env.TOKEN_MINT!)
    );
    const DECIMALS = mintInfo.decimals;
    console.log(DECIMALS);
    const adjustedAmount = amount * Math.pow(10, DECIMALS);

    const instructions = createTransferCheckedInstruction(
      new PublicKey(process.env.TOKEN_MINT_ACCOUNT!), // from token account
      new PublicKey(process.env.TOKEN_MINT!), // token mint
      ata, // to token account
      from.publicKey, // from user public key
      adjustedAmount, // amount
      DECIMALS // decimals
    );

    transaction.add(instructions);

    const fromTokenAccountInfo = await conn.getAccountInfo(
      new PublicKey(process.env.TOKEN_MINT_ACCOUNT!)
    );
    console.log(fromTokenAccountInfo);

    const result = await sendAndConfirmTransaction(conn, transaction, [from]);
    console.log(result);

    console.log("Receiver token account created successfully");
    console.log("Devnet tokens airdropped successfully");

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error airdropping tokens");
  }
}
