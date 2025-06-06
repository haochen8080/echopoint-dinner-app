import express from 'express';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { supabase } from '../supabaseClient';
import cors from 'cors';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

router.use(cors());
router.use(express.raw({ type: 'application/json' }));

router.post('/', function(req, res) {
  const sig = req.headers['stripe-signature']!;
  
  Promise.resolve().then(async () => {
    const buf = await buffer(req);
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update the events_signup record
        const { error } = await supabase
          .from('events_signup')
          .update({
            payment_status: 'completed',
            stripe_payment_id: session.payment_intent as string,
            payment_url: session.url,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.metadata?.event_signup_id);

        if (error) {
          console.error('Error updating event signup:', error);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update the events_signup record for subscription
        const { error } = await supabase
          .from('events_signup')
          .update({
            payment_status: 'completed',
            subscription_status: subscription.status === 'active' ? 'active' : 'cancelled',
            stripe_payment_id: subscription.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.metadata?.event_signup_id);

        if (error) {
          console.error('Error updating subscription status:', error);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update the subscription status to cancelled
        const { error } = await supabase
          .from('events_signup')
          .update({
            subscription_status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.metadata?.event_signup_id);

        if (error) {
          console.error('Error updating subscription status:', error);
        }
        break;
      }
    }

    res.json({ received: true });
  }).catch(err => {
    console.error('Error processing webhook:', err);
    res.status(500).end();
  });
});

export default router; 