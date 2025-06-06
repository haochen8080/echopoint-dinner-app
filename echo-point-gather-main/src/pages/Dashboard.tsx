import React from 'react';
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";

type Profile = {
  id: string;
  email: string;
  university: string;
  wechat_id: string;
  gender: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states for profile creation
  const [university, setUniversity] = useState("");
  const [wechatId, setWechatId] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
          // Check if profile exists
          const { data: existingProfile, error: fetchError } = await supabase
          .from("users_profile")
          .select("*")
            .eq("id", user.id)
          .single();

          if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            throw fetchError;
          }

          if (existingProfile) {
            setProfile(existingProfile);
          }
        }
      } catch (err: unknown) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProfile();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const { data: newProfile, error: insertError } = await supabase
        .from("users_profile")
        .insert([
          {
            id: user.id,
            email: user.email,
            university,
            wechat_id: wechatId,
            gender
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      setProfile(newProfile);
    } catch (err: unknown) {
      console.error("Error creating profile:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleOneTimeTicket = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user || !profile) {
        throw new Error('Please log in and complete your profile first');
      }

      // Create event signup record
      const { data: eventSignup, error: signupError } = await supabase
        .from('events_signup')
        .insert({
          user_id: user.id,
          profile_id: profile.id,
          event_date: new Date().toISOString().split('T')[0],
          payment_type: 'one_time',
          payment_status: 'pending',
          amount: 9.99,
          subscription_status: null
        })
        .select()
        .single();

      if (signupError) {
        throw signupError;
      }

      // After successful record creation, redirect to Stripe
      window.location.href = 'https://buy.stripe.com/9B6bJ29amd8J62h0m5fEk01';
    } catch (err: unknown) {
      console.error("Error creating ticket record:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-lg">Loading...</div>;
  }

  if (!user) {
    return <div className="p-6 text-lg">Please log in to see your dashboard.</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Show profile creation form if profile doesn't exist
  if (!profile) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
            <CardHeader className="space-y-2">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">👋</span>
              </div>
              <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Welcome to EchoPoint
              </CardTitle>
              <p className="text-center text-gray-600">
                Let's get to know you better
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🎓</span>
                      University
                    </span>
                  </label>
                  <Input
                    placeholder="Your university"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    required
                    className="transition-all border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">💬</span>
                      WeChat ID
                    </span>
                  </label>
                  <Input
                    placeholder="Your WeChat ID"
                    value={wechatId}
                    onChange={(e) => setWechatId(e.target.value)}
                    required
                    className="transition-all border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">👤</span>
                      Gender
                    </span>
                  </label>
                  <Select onValueChange={setGender} required>
                    <SelectTrigger className="w-full transition-all border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Complete Profile →
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show dashboard with profile info and dinner options
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Welcome Back! ✨
              </h1>
              <p className="text-gray-600">Your dinner adventures await</p>
            </div>
            <Button 
              onClick={handleSignOut} 
              variant="outline"
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎓</span>
                <div>
                  <p className="text-sm text-gray-500">University</p>
                  <p className="font-medium text-gray-900">{profile.university}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">👤</span>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-900">{profile.gender}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="text-sm text-gray-500">WeChat ID</p>
                  <p className="font-medium text-gray-900">{profile.wechat_id}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-transparent opacity-20 rounded-xl"></div>
            <div className="relative pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-3xl">🍜</span>
                Available Dinner Events
              </h2>
              <div className="bg-blue-50/80 backdrop-blur-sm p-4 rounded-xl mb-6 border border-blue-100">
                <p className="text-blue-600">You can now join dinner events! Check back soon for upcoming events.</p>
      </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* One-time Ticket Card */}
                <button 
                  onClick={handleOneTimeTicket}
                  disabled={loading}
                  className="group relative overflow-hidden p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 text-center w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <h3 className="text-xl font-semibold mb-2">One-time Ticket</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-2">$9.99</p>
                    <p className="text-gray-600 mb-4">Sunday, June 8, 6:30 pm</p>
                    <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-100 transition-colors">
                      {loading ? 'Processing...' : 'Buy Ticket →'}
                    </span>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.href='https://buy.stripe.com/eVq28sbiu8St62h1q9fEk00'}
                  className="group relative overflow-hidden p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 text-center w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <h3 className="text-xl font-semibold mb-2">Monthly Subscription</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-2">
                      $14.99
                      <span className="text-base font-normal text-gray-500">/mo</span>
                    </p>
                    <p className="text-gray-600 mb-4">Access all monthly events</p>
                    <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-100 transition-colors">
                      Subscribe →
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced subscription management section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">💳</span>
              Manage Subscription
            </h2>
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
              <p className="text-gray-600 mb-4">
                Need to manage or cancel your subscription? Click the button below to access your subscription settings.
              </p>
              <button
                onClick={() => window.location.href='https://billing.stripe.com/p/login/eVq28sbiu8St62h1q9fEk00'}
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
              >
                <span className="mr-2">Manage Subscription</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
              <p className="mt-4 text-sm text-gray-500">
                You'll be redirected to Stripe's secure customer portal where you can view your subscription details, billing history, and manage your subscription.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
