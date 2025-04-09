import { NextApiRequest, NextApiResponse } from 'next';
import createMoMoUrl from '@/lib/api/momo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, orderInfo, returnUrl, ipnUrl,requestType } = req.body;

    // Validate required fields
    if (!amount || !orderInfo || !returnUrl || !ipnUrl||!requestType) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          amount: !amount ? 'Amount is required' : null,
          orderInfo: !orderInfo ? 'Order info is required' : null,
          returnUrl: !returnUrl ? 'Return URL is required' : null,
          ipnUrl: !ipnUrl ? 'IPN URL is required' : null,
          requestType: !requestType ? 'requestType is required' : null
        }
      });
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        details: 'Amount must be a positive number'
      });
    }

    const paymentUrl = await createMoMoUrl(amount, orderInfo, returnUrl, ipnUrl,requestType);
    
    if (!paymentUrl) {
      throw new Error('Failed to generate MoMo payment URL');
    }

    res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error('[MOMO_API_ERROR]', error);
    res.status(500).json({
      error: 'Error creating payment URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}