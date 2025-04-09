import { NextApiRequest, NextApiResponse } from "next";
import createVNPayUrl from "@/lib/api/vnpay";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { amount, orderInfo, returnUrl } = req.body;

      if (!amount || !orderInfo || !returnUrl) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const paymentUrl = createVNPayUrl(amount, orderInfo, returnUrl);
      res.status(200).json({ paymentUrl });
    } catch (error) {
      console.error("[VNPAY_ERROR]", error);
      res.status(500).json({ error: "Error creating payment URL" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
