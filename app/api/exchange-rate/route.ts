import { NextResponse } from "next/server";

export async function GET() {
  const defaultRate = 24000;
  const accessKey = "d977c08440ef7dbe5b160a9b8c4c4eda";

  try {
    const response = await fetch(
      `https://api.exchangerate.host/live?access_key=${accessKey}`,
    );

    const data = await response.json();

    const rate = data?.quotes?.USDVND;

    if (!rate || typeof rate !== "number") {
      throw new Error("Invalid exchange rate data");
    }

    return NextResponse.json({ rate });
  } catch (error) {
    console.error("[EXCHANGE_RATE_ERROR]", error);
    return NextResponse.json({ rate: defaultRate });
  }
}
