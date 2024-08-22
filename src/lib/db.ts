import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export async function DBconnection(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to DB");
    return;
  }

  try {
    console.log(process.env.MONGO_URI);
    const db = await mongoose.connect(process.env.MONGO_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("Error while connecting to DB");
    process.exit(1);
  }
}
