// src/app/api/stripe/create-checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

if (!process.env.STRIPE_SECRET_KEY || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required ENV for Stripe create-checkout. Set STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-08-27.basil' });
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

const TARGET_NET_CENTS = process.env.TARGET_NET_CENTS ? parseInt(process.env.TARGET_NET_CENTS, 10) : 21000;    // 210.00
const STRIPE_PERCENT = process.env.STRIPE_PERCENT ? parseFloat(process.env.STRIPE_PERCENT) : 0.014;            // 1.4 %
const STRIPE_FIXED_CENTS = process.env.STRIPE_FIXED_CENTS ? parseInt(process.env.STRIPE_FIXED_CENTS, 10) : 25; // 0.25

function calcGrossAmount(netCents: number) {
  return Math.ceil((netCents + STRIPE_FIXED_CENTS) / (1 - STRIPE_PERCENT));
}

const AMOUNT_CENTS = calcGrossAmount(TARGET_NET_CENTS);
const CURRENCY = process.env.CURRENCY || 'eur';

function getBearerToken(req: Request): string | null {
  const h = req.headers.get('authorization');
  if (!h) return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { registrationId } = body;

    if (!registrationId) {
      return NextResponse.json({ error: 'registrationId required' }, { status: 400 });
    }

    const token = getBearerToken(req);
    if (!token) {
      return NextResponse.json({ error: 'authentication_required' }, { status: 401 });
    }

    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      console.error('Could not validate auth token:', userErr);
      return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
    }
    const callerUserId = userData.user.id;

    const { data: reg, error: regErr } = await supabase
      .from('registrations')
      .select('id, user_id')
      .eq('id', registrationId)
      .single();

    if (regErr || !reg) {
      return NextResponse.json({ error: 'registration_not_found' }, { status: 404 });
    }

    if (reg.user_id !== callerUserId) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const host = req.headers.get('host') || '';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = `${proto}://${host}`;
    const successUrl = `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/payment/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            product_data: { name: 'Inscription sportive' },
            unit_amount: AMOUNT_CENTS,
          },
          quantity: 1,
        },
      ],
      metadata: {
        registration_id: registrationId,
        user_id: reg.user_id,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('create-checkout error:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

