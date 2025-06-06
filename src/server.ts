import express from 'express';
import checkoutRouter from './api/create-checkout-session';
import subscriptionRouter from './api/create-subscription';
import webhookRouter from './api/webhook';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// For the webhook endpoint, we need the raw body
app.use('/api/webhook', express.raw({ type: 'application/json' }));

// For other endpoints, use JSON parsing
app.use(express.json());

// Register routes
app.use('/api/webhook', webhookRouter);
app.use('/api/create-checkout-session', checkoutRouter);
app.use('/api/create-subscription', subscriptionRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 