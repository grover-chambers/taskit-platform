import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const supabase = createAdminClient();
  const body = await request.json();

  try {
    const stkCallback = body.Body.stkCallback;
    const checkoutRequestId = stkCallback.CheckoutRequestID;

    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('checkout_request_id', checkoutRequestId)
      .single();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (stkCallback.ResultCode === 0) {
      const mpesaReceipt = stkCallback.CallbackMetadata.Item.find(
        (item: any) => item.Name === 'MpesaReceiptNumber'
      )?.Value;

      await supabase
        .from('orders')
        .update({
          payment_status: 'PAID',
          status: 'RIDER_ASSIGNMENT',
          mpesa_receipt: mpesaReceipt,
        })
        .eq('id', order.id);
    } else {
      await supabase
        .from('orders')
        .update({ payment_status: 'FAILED' })
        .eq('id', order.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
