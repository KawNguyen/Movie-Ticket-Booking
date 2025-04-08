import crypto from 'crypto';

// Các thông số cấu hình của VNPAY
const VNP_TMN_CODE = 'SPIM7O70';  // Mã Website
const VNP_SECRET_KEY = '87N0A0OF9H63STRLUFKBK16EM3X8KHNH';  // Chuỗi bí mật
const VNP_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';  // URL thanh toán

interface VNPayParams {
  vnp_TmnCode: string;
  vnp_Amount: number;
  vnp_Command: string;
  vnp_CreateDate: string;
  vnp_CurrCode: string;
  vnp_Locale: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_ReturnUrl: string;
  //vnp_ExpireDate: string;
  vnp_SecureHash?: string;
  [key: string]: string | number | boolean | undefined;
}

// Hàm tạo checksum
function createChecksum(params: VNPayParams) {
  // Sắp xếp tham số theo đúng thứ tự yêu cầu
  const orderedParams = [
    'vnp_Version',
    'vnp_TmnCode',
    'vnp_TxnRef',
    'vnp_Amount',
    'vnp_Command',
    'vnp_CreateDate',
    'vnp_CurrCode',
    'vnp_Locale',
    'vnp_OrderInfo',
    'vnp_OrderType',
    'vnp_ReturnUrl',
    'vnp_ExpireDate',
    'vnp_IpAddr'
  ];

  // Tạo chuỗi đã được sắp xếp theo thứ tự
  const sortedParams = orderedParams
    .filter(key => params[key] !== undefined)
    .map(key => `${key}=${params[key]}`)
    .join('&');

  // Tạo checksum với chuỗi đã sắp xếp
  const hmac = crypto.createHmac('sha512', VNP_SECRET_KEY);
  return hmac.update(Buffer.from(sortedParams, 'utf-8')).digest('hex');
}


// Hàm tạo ngày hết hạn
// function formatVNPayExpireDate() {
//   const date = new Date();
//   const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000)); // Thêm 7 giờ vào UTC
//   const expireTime = new Date(vietnamTime.getTime() + (1 * 60 * 60 * 1000)); // Cộng thêm 1 giờ
//   const formattedDate = expireTime
//     .toISOString()
//     .replace(/[-T:.Z]/g, '')
//     .slice(0, 14);

//   return formattedDate;
// }

// Hàm tạo ngày tạo
function CreateDate() {
  const date = new Date();
  const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000)); // Thêm 7 giờ vào UTC
  const formattedCreateDate = vietnamTime
    .toISOString()
    .replace(/[-T:.Z]/g, '')
    .slice(0, 14);

  return formattedCreateDate;
}

// Hàm tạo URL thanh toán
function createPaymentUrl(amount: number, orderInfo: string, returnUrl: string) {
  const createDate = CreateDate();

  const vnp_Params: VNPayParams = {
    vnp_Amount: amount * 10000,  // Convert to VND (smallest unit)
    vnp_Command: 'pay',
    vnp_CreateDate: createDate,
    vnp_CurrCode: 'VND',
    vnp_IpAddr: '127.0.0.1',
    vnp_Locale: 'vn',
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_ReturnUrl: returnUrl,
    vnp_TmnCode: VNP_TMN_CODE,
    vnp_TxnRef: Date.now().toString(),
    vnp_Version: '2.1.0',
    //vnp_ExpireDate: formatVNPayExpireDate()
  };

  // Tính toán checksum và thêm vào vnp_Params
  const secureHash = createChecksum(vnp_Params);
  vnp_Params.vnp_SecureHash = secureHash;

  // Xây dựng URL với các tham số đã sắp xếp
  const queryString = Object.keys(vnp_Params)
    .filter(key => vnp_Params[key as keyof VNPayParams] !== undefined)
    .map(key => `${key}=${encodeURIComponent(vnp_Params[key as keyof VNPayParams] as string | number | boolean)}`)
    .join('&');

  return `${VNP_URL}?${queryString}`;
}



export default function createVNPayUrl(amount: number, orderInfo: string, returnUrl: string) {
  return createPaymentUrl(amount, orderInfo, returnUrl);
}
