import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { supabase } from "../supabaseClient";

export default function JoinForm() {
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [wechat, setWechat] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Insert into users_profile table
    const { error } = await supabase.from("users_profile").insert([
      {
        email,
        university,
        wechat_id: wechat,
        gender
      }
    ]);

    if (error) {
      alert("Failed to save profile: " + error.message);
      return;
    }

    // Send magic link for email sign-in
    const { error: authError } = await supabase.auth.signInWithOtp({ email });

    if (authError) {
      alert("Failed to send login link: " + authError.message);
    } else {
      alert("Profile saved! Check your email for the login link!");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Join EchoPoint</CardTitle>
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
            <div>
              <label className="block mb-1 font-medium">University</label>
              <Input
                placeholder="Your university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">WeChat ID</label>
              <Input
                placeholder="Your WeChat ID"
                value={wechat}
                onChange={(e) => setWechat(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Gender</label>
              <Select onValueChange={setGender} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white text-lg">
              Join the dinner →
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
