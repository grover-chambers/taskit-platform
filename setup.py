import os

files = {
    "tailwind.config.ts": """import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        surface: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'premium': '0 10px 40px -10px rgba(16, 185, 129, 0.2)',
      }
    },
  },
  plugins: [],
}
export default config
""",
    "src/app/globals.css": """@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-surface-50 text-surface-900 antialiased;
  }
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  @apply bg-surface-100;
}
::-webkit-scrollbar-thumb {
  @apply bg-surface-300 rounded-full;
}
""",
    ".env.local": """# === SUPABASE ===
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# DANGER: This key bypasses Row Level Security. NEVER use in frontend code.
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# === BASE URL ===
NEXT_PUBLIC_BASE_URL=http://localhost:3000 

# === SAFARICOM DARAJA API (M-PESA) ===
MPESA_CONSUMER_KEY=your_daraja_consumer_key
MPESA_CONSUMER_SECRET=your_daraja_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_AUTH_URL=https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
MPESA_STK_URL=https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest

# === AFRICA'S TALKING ===
AT_API_KEY=your_africas_talking_api_key
AT_USERNAME=sandbox
""",
    "src/lib/supabase/client.ts": """import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
""",
    "src/lib/supabase/server.ts": """import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The setAll method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}
""",
    "src/lib/supabase/admin.ts": """import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
""",
    "src/lib/mpesa/index.ts": """import axios from 'axios';

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
""",
    "src/app/api/payments/mpesa/route.ts": """import { NextResponse } from 'next/server';
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
""",
    "src/app/api/webhooks/mpesa/route.ts": """import { NextResponse } from 'next/server';
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
""",
    "src/app/api/orders/route.ts": """import { NextResponse } from 'next/server';
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
"""
}

for filepath, content in files.items():
    dirpath = os.path.dirname(filepath)
    if dirpath:
        os.makedirs(dirpath, exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content.strip() + "\n")
    print(f"Created: {filepath}")

print("\nAll Backend files scaffolded successfully!")
