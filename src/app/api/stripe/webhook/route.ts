// src/app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required ENV for Stripe webhook. Ensure STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Invalid webhook signature:', err);
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const registrationId = session.metadata?.registration_id ?? null;
      const userIdFromMetadata = session.metadata?.user_id ?? null;
      const stripePaymentId = session.payment_intent?.toString() ?? session.id;

      if (!registrationId || !stripePaymentId) {
        console.error('Webhook: missing metadata.registration_id or payment identifier', {
          sessionId: session.id,
          metadata: session.metadata,
        });
        return NextResponse.json({ ok: true });
      }

      const { data: existing, error: existingError } = await supabase
        .from('payments')
        .select('id')
        .eq('stripe_payment_id', stripePaymentId)
        .limit(1)
        .maybeSingle();

      if (existingError) {
        console.error('Supabase error checking existing payment:', existingError);
        return NextResponse.json({ error: 'db_error' }, { status: 500 });
      }

      if (existing) {
        console.log('Webhook: payment already recorded, skipping:', stripePaymentId);
        return NextResponse.json({ ok: true });
      }

      const insertPayload = {
        registration_id: registrationId,
        user_id: userIdFromMetadata,
        stripe_payment_id: stripePaymentId,
        amount: session.amount_total ?? 0,
        currency: session.currency ?? 'eur',
        status: 'succeeded',
      };

      const { error: insertError } = await supabase.from('payments').insert([insertPayload]);

      if (insertError) {
        console.error('Supabase insert payments error:', insertError);
        return NextResponse.json({ error: 'db_insert_error' }, { status: 500 });
      }

      const { error: updateError } = await supabase
        .from('registrations')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', registrationId);

      if (updateError) {
        console.error('Supabase update registrations error:', updateError);
        return NextResponse.json({ error: 'db_update_error' }, { status: 500 });
      }

      console.log('Webhook: payment recorded and registration updated:', stripePaymentId);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Unhandled webhook processing error:', err);
    return NextResponse.json({ error: 'processing_error' }, { status: 500 });
  }
}

