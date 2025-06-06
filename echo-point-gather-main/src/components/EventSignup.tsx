import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const EventSignup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createEventSignup = async (paymentType: 'one_time' | 'subscription', amount: number) => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Get user's profile
      const { data: profile } = await supabase
        .from('users_profile')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        console.error('User profile not found');
        return;
      }

      // Create event signup record
      const { data: eventSignup, error } = await supabase
        .from('events_signup')
        .insert({
          user_id: user.id,
          profile_id: profile.id,
          event_date: new Date().toISOString().split('T')[0], // Current date as default
          payment_type: paymentType,
          payment_status: 'pending',
          amount: amount,
          subscription_status: paymentType === 'subscription' ? 'active' : null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating event signup:', error);
        return;
      }

      // Here you would typically create a Stripe checkout session and redirect to it
      // The webhook will update the payment_status and other fields later
      const checkoutUrl = paymentType === 'one_time' 
        ? `/api/create-checkout-session?event_signup_id=${eventSignup.id}`
        : `/api/create-subscription?event_signup_id=${eventSignup.id}`;

      window.location.href = checkoutUrl;

    } catch (error) {
      console.error('Error in createEventSignup:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl text-center text-red-500 mb-4">Test - Event Signup Page</h1>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Available Dinner Events
          </h1>
          <p className="text-xl text-blue-600 font-semibold">
            Sunday, June 8, 6:30 pm
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* One-time Ticket Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                One-time Ticket
              </h3>
              <p className="text-4xl font-bold text-center text-gray-900 mb-6">
                $9.99
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Single event access
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Full dinner experience
                </li>
              </ul>
              <button
                onClick={() => createEventSignup('one_time', 9.99)}
                disabled={loading}
                className="w-full bg-blue-600 text-white rounded-md py-3 px-4 hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Buy One-Time Ticket'}
              </button>
            </div>
          </div>

          {/* Monthly Subscription Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-500">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Monthly Subscription
              </h3>
              <p className="text-4xl font-bold text-center text-gray-900 mb-6">
                $14.99
                <span className="text-lg font-normal text-gray-500">/month</span>
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Access to all monthly events
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Priority reservations
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Special member benefits
                </li>
              </ul>
              <button
                onClick={() => createEventSignup('subscription', 14.99)}
                disabled={loading}
                className="w-full bg-blue-600 text-white rounded-md py-3 px-4 hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Subscribe Monthly'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSignup; 