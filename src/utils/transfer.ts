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
import { createTransferCheckedInstruction } from "@solana/spl-token";

export async function transfer(to: string, amount: number, network: Cluster) {
  try {
    const conn = new Connection(clusterApiUrl(network), "confirmed");
    const transaction = new Transaction();

    const ToPublicKey = new PublicKey(to);

    const secret = Uint8Array.from(
      JSON.parse(process.env.SOLANA_KEYPAIR!) || "[]"
    );

    const from = Keypair.fromSecretKey(secret);

    const instructions = createTransferCheckedInstruction(
      new PublicKey("5v9AsaAx34paZpNqUtWxRr3fUec5uqK5AvxDg9Mado9f"),
      new PublicKey(process.env.TOKEN_MINT!),
      ToPublicKey,
      from.publicKey,
      amount,
      0
    );

    transaction.add(instructions);
    await conn.sendTransaction(transaction, [from]);
    console.log("Devnet tokens airdropped successfully");
  } catch (error) {
    console.log(error);
  }
}
