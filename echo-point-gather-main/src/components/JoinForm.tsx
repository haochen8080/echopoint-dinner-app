import React from 'react';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "../supabaseClient";

export default function JoinForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      }
    });

    if (authError) {
      alert("Failed to send verification link: " + authError.message);
      return;
    }

    alert("Check your email for the verification link! (It may take a few minutes to arrive)");
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Join EchoPoint</CardTitle>
          <p className="text-center text-gray-600 mt-2">
            Enter your email to get started. We'll send you a verification link.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input
                type="email"
                placeholder="Your school email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white text-lg">
              Join Now →
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
