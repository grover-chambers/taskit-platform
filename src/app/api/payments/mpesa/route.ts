import { NextResponse } from 'next/server';
import { initiateSTKPush } from '@/lib/mpesa';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phoneNumber, amount, orderId } = await request.json();

    if (!phoneNumber || !amount || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const stkResponse = await initiateSTKPush(phoneNumber, amount, orderId);

    await supabase
      .from('orders')
      .update({ payment_status: 'PENDING', checkout_request_id: stkResponse.CheckoutRequestID })
      .eq('id', orderId);

    return NextResponse.json({ success: true, message: 'STK Push initiated', data: stkResponse });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
