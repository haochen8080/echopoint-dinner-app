import React from 'react';
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import JoinForm from "@/components/JoinForm";
import LoginForm from "@/components/LoginForm";
import EventSignup from "@/components/EventSignup";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import { supabase } from "./supabaseClient";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      // Check if user is admin (you can set this in Supabase user metadata)
      setIsAdmin(user?.user_metadata?.is_admin === true);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.user_metadata?.is_admin === true);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/join" element={!user ? <JoinForm /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin" element={
          user && isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" />
        } />
        <Route path="/events" element={<EventSignup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
