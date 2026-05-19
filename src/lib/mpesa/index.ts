import axios from 'axios';

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const SHORTCODE = process.env.MPESA_SHORTCODE!;
const PASSKEY = process.env.MPESA_PASSKEY!;
const AUTH_URL = process.env.MPESA_AUTH_URL!;
const STK_URL = process.env.MPESA_STK_URL!;

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(CONSUMER_KEY + ':' + CONSUMER_SECRET).toString('base64');
  const response = await axios.get(AUTH_URL, {
    headers: { Authorization: 'Basic ' + auth },
  });
  return response.data.access_token;
}

export async function initiateSTKPush(phoneNumber: string, amount: number, orderId: string) {
  const accessToken = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = Buffer.from(SHORTCODE + PASSKEY + timestamp).toString('base64');

  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: SHORTCODE,
    PhoneNumber: phoneNumber,
    CallBackURL: process.env.NEXT_PUBLIC_BASE_URL + '/api/webhooks/mpesa',
    AccountReference: orderId,
    TransactionDesc: 'Payment for TaskIt Order ' + orderId,
  };

  try {
    const response = await axios.post(STK_URL, payload, {
      headers: { Authorization: 'Bearer ' + accessToken },
    });
    return response.data;
  } catch (error: any) {
    console.error('STK Push Failed:', error.response?.data || error.message);
    throw new Error('Failed to initiate M-Pesa payment');
  }
}
