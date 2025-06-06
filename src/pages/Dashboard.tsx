import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

type Profile = {
  id: string;
  email: string;
  university: string;
  wechat_id: string;
  gender: string;
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [university, setUniversity] = useState('');
  const [wechatId, setWechatId] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: existingProfile, error: fetchError } = await supabase
            .from("users_profile")
            .select("*")
            .eq("id", user.id)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
          }

          if (existingProfile) {
            setProfile(existingProfile);
            setUniversity(existingProfile.university);
            setWechatId(existingProfile.wechat_id);
            setGender(existingProfile.gender);
          }
        }
      } catch (err) {
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
    } catch (err) {
      console.error("Error creating profile:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default Dashboard; 