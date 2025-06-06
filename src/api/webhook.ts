import express, { RequestHandler } from 'express';
import Stripe from 'stripe';
import { supabase } from '../supabaseClient';
import cors from 'cors';

const router = express.Router();
router.use(cors());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const handleWebhook: RequestHandler = async (req, res) => {
  const sig = req.headers['stripe-signature']!;
  
  try {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      console.log('Webhook event type:', event.type);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Processing checkout session:', session.id);
        
        // If event_signup_id is in metadata, use it directly
        if (session.metadata?.event_signup_id) {
          const { error } = await supabase
            .from('events_signup')
            .update({
              payment_status: 'paid',
              stripe_payment_id: session.payment_intent as string,
              updated_at: new Date().toISOString()
            })
            .eq('id', session.metadata.event_signup_id);

          if (error) {
            console.error('Error updating event signup:', error);
          } else {
            console.log('Event signup updated via metadata');
          }
        } 
        // For direct Stripe links, match by amount and customer email
        else if (session.amount_total === 999) { // $9.99 in cents
          const customerDetails = session.customer_details;
          if (customerDetails?.email) {
            // Find pending $9.99 one-time ticket for this user
            const { data: eventSignup, error: fetchError } = await supabase
              .from('events_signup')
              .select('id, user_id')
              .eq('amount', 9.99)
              .eq('payment_type', 'one_time')
              .eq('payment_status', 'pending')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            if (eventSignup && !fetchError) {
              // Get user email to verify it matches
              const { data: { user } } = await supabase.auth.admin.getUserById(eventSignup.user_id);
              
              if (user?.email === customerDetails.email) {
                const { error } = await supabase
                  .from('events_signup')
                  .update({
                    payment_status: 'paid',
                    stripe_payment_id: session.payment_intent as string,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', eventSignup.id);

                if (error) {
                  console.error('Error updating event signup:', error);
                } else {
                  console.log('$9.99 payment matched and updated');
                }
              }
            }
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        if (subscription.metadata?.event_signup_id) {
          const { error } = await supabase
            .from('events_signup')
            .update({
              payment_status: 'paid',
              subscription_status: subscription.status === 'active' ? 'active' : 'cancelled',
              stripe_payment_id: subscription.id,
              updated_at: new Date().toISOString()
            })
            .eq('id', subscription.metadata.event_signup_id);

          if (error) {
            console.error('Error updating subscription status:', error);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        if (subscription.metadata?.event_signup_id) {
          const { error } = await supabase
            .from('events_signup')
            .update({
              subscription_status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('id', subscription.metadata.event_signup_id);

          if (error) {
            console.error('Error updating subscription status:', error);
          }
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).end();
  }
};

router.post('/', handleWebhook);

export default router; 