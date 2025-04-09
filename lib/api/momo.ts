import crypto from 'crypto';

// Thông số cấu hình MoMo
const MOMO_PARTNER_CODE = 'MOMOBKUN20180529';
const MOMO_ACCESS_KEY = 'klm05TvNBzhg7h7j';
const MOMO_SECRET_KEY = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
const MOMO_ENDPOINT = 'https://test-payment.momo.vn/v2/gateway/api/create';

interface MoMoParams {
  partnerCode: string;
  partnerName?: string;
  storeId?: string;
  requestId: string;
  amount: number;
  orderId: string;
  orderInfo: string;
  redirectUrl: string;
  ipnUrl: string;
  lang?: string;
  extraData: string;
  requestType: string;
  signature?: string;
  [key: string]: string | number | undefined;
}

// Hàm tạo chữ ký
function createSignature(params: MoMoParams): string {
  const rawSignature = [
    'accessKey=' + MOMO_ACCESS_KEY,
    'amount=' + params.amount,
    'extraData=' + params.extraData,
    'ipnUrl=' + params.ipnUrl,
    'orderId=' + params.orderId,
    'orderInfo=' + params.orderInfo,
    'partnerCode=' + params.partnerCode,
    'redirectUrl=' + params.redirectUrl,
    'requestId=' + params.requestId,
    'requestType=' + params.requestType
  ].join('&');

  const signature = crypto
    .createHmac('sha256', MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest('hex');

  return signature;
}

// Hàm tạo URL thanh toán MoMo
export default async function createMoMoUrl(
    amount: number,
    orderInfo: string,
    redirectUrl: string,
    ipnUrl: string,
    requestType: string
  ) {
    // Validate input parameters
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount: Amount must be a positive number');
    }
    if (!orderInfo?.trim()) {
      throw new Error('Invalid orderInfo: Order information is required');
    }
    if (!redirectUrl?.trim() || !redirectUrl.startsWith('http')) {
      throw new Error('Invalid redirectUrl: Must be a valid HTTP(S) URL');
    }
    if (!ipnUrl?.trim() || !ipnUrl.startsWith('http')) {
      throw new Error('Invalid ipnUrl: Must be a valid HTTP(S) URL');
    }
  
    const requestId = Date.now().toString();
    const orderId = `ORDER_${requestId}`; // More descriptive order ID
  
    const momoParams: MoMoParams = {
      partnerCode: MOMO_PARTNER_CODE,
      partnerName: 'Movie Ticket Booking',
      storeId: 'MovieTicketStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: 'vi',
      extraData: '',
      requestType: requestType
    };
  
    try {
      // Create signature
      momoParams.signature = createSignature(momoParams);
  
      // Send request to MoMo
      const response = await fetch(MOMO_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(momoParams)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(
          `MoMo API Error: ${data.message || `HTTP error! status: ${response.status}`}`
        );
      }
  
      if (!data.payUrl) {
        throw new Error(
          `MoMo Payment URL Error: ${data.message || 'Could not create payment URL'}`
        );
      }
  
      return data.payUrl;
    } catch (error) {
      console.error('[MOMO_CREATE_URL_ERROR]', {
        error,
        params: { ...momoParams, signature: '***' }
      });
      throw error instanceof Error 
        ? error 
        : new Error('Failed to create MoMo payment URL');
    }
  }
  