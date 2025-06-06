import express, { RequestHandler } from 'express';
import Stripe from 'stripe';
import { supabase } from '../supabaseClient';
import cors from 'cors';

const router = express.Router();
router.use(cors());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const handleSubscription: RequestHandler = async (req, res) => {
  try {
    const event_signup_id = req.query.event_signup_id as string;
    
    if (!event_signup_id) {
      res.status(400).json({ error: 'Missing event_signup_id' });
      return;
    }

    // Get the event signup record
    const { data: eventSignup, error: fetchError } = await supabase
      .from('events_signup')
      .select('*')
      .eq('id', event_signup_id)
      .single();

    if (fetchError || !eventSignup) {
      console.error('Error fetching event signup:', fetchError);
      res.status(404).json({ error: 'Event signup not found' });
      return;
    }

    // Create Stripe checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Monthly Event Subscription',
              description: 'Access to all monthly events',
            },
            unit_amount: Math.round(eventSignup.amount * 100), // Convert to cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?canceled=true`,
      metadata: {
        event_signup_id,
      },
    });

    // Update the event signup with the session URL
    const { error: updateError } = await supabase
      .from('events_signup')
      .update({
        payment_url: session.url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', event_signup_id);

    if (updateError) {
      console.error('Error updating event signup:', updateError);
    }

    res.json({ url: session.url });
  } catch (err) {
    console.error('Error creating subscription session:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.post('/', handleSubscription);

export default router; 