import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { zone, errand_description, price, pickup_location } = await request.json();

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_id: user.id,
        zone,
        errand_description,
        price,
        pickup_location,
        status: 'RECEIVED',
        payment_status: 'UNPAID',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
