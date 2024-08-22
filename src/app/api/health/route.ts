import { NextResponse } from "next/server";

export function GET(req: Request) {
  console.log("Healthy server");
  return NextResponse.json({ message: "Healthy server" });
}
