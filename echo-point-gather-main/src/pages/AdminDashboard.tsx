import React, { useEffect, useState } from 'react';
import { supabase } from "../supabaseClient";

interface PaymentActivity {
  id: string;
  user_id: string;
  profile_id: string;
  payment_type: 'one_time' | 'subscription';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  subscription_status: 'active' | 'cancelled' | 'expired' | null;
  amount: number;
  stripe_payment_id: string;
  created_at: string;
  userProfile?: {
    email: string;
    university: string;
    wechat_id: string;
  };
}

export default function AdminDashboard() {
  const [activities, setActivities] = useState<PaymentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSubscriptions: 0,
    oneTimePayments: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    fetchPaymentActivities();
  }, []);

  const fetchPaymentActivities = async () => {
    try {
      setLoading(true);
      
      // Fetch payment activities with user profiles
      const { data, error } = await supabase
        .from('events_signup')
        .select(`
          *,
          userProfile:users_profile(email, university, wechat_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setActivities(data);
        
        // Calculate statistics
        const stats = data.reduce((acc, curr) => ({
          totalRevenue: acc.totalRevenue + (curr.payment_status === 'completed' ? curr.amount : 0),
          activeSubscriptions: acc.activeSubscriptions + (curr.subscription_status === 'active' ? 1 : 0),
          oneTimePayments: acc.oneTimePayments + (curr.payment_type === 'one_time' && curr.payment_status === 'completed' ? 1 : 0),
          pendingPayments: acc.pendingPayments + (curr.payment_status === 'pending' ? 1 : 0)
        }), {
          totalRevenue: 0,
          activeSubscriptions: 0,
          oneTimePayments: 0,
          pendingPayments: 0
        });

        setStats(stats);
      }
    } catch (error) {
      console.error('Error fetching payment activities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading payment activities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Payment Activity Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm">Active Subscriptions</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.activeSubscriptions}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm">One-time Payments</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.oneTimePayments}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm">Pending Payments</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</p>
          </div>
        </div>

        {/* Payment Activity Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Recent Payment Activities</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {activity.userProfile?.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.userProfile?.university}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.payment_type === 'subscription' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {activity.payment_type === 'subscription' ? 'Subscription' : 'One-time'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${activity.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.payment_status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : activity.payment_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {activity.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 