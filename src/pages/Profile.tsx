import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Trophy, Flame, Zap, Crown, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  total_wins: number;
  current_streak: number;
  longest_streak: number;
  level: number;
  xp: number;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=signin');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (data) {
      setProfile(data);
      setFullName(data.full_name || '');
      setUsername(data.username || '');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim() || null,
        username: username.trim() || null,
      })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Error saving',
        description: 'Could not save your profile. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Profile saved! 🎉',
        description: 'Your changes have been saved.',
      });
    }
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const achievements = [
    { 
      icon: Trophy, 
      label: 'Total Wins', 
      value: profile?.total_wins || 0,
      gradient: 'gradient-primary',
    },
    { 
      icon: Flame, 
      label: 'Current Streak', 
      value: `${profile?.current_streak || 0} days`,
      gradient: 'gradient-streak',
    },
    { 
      icon: Crown, 
      label: 'Longest Streak', 
      value: `${profile?.longest_streak || 0} days`,
      gradient: 'gradient-hero',
    },
    { 
      icon: Zap, 
      label: 'Total XP', 
      value: profile?.xp || 0,
      gradient: 'gradient-xp',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl font-bold">Profile</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Avatar & Level */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-3xl gradient-hero flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl gradient-xp flex items-center justify-center border-4 border-background">
                <span className="text-sm font-bold text-xp-foreground">{profile?.level || 1}</span>
              </div>
            </div>
            <h2 className="font-display text-2xl font-bold">
              {profile?.full_name || 'Champion'}
            </h2>
            <p className="text-muted-foreground">Level {profile?.level || 1} Habit Builder</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {achievements.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card p-5 text-center"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${item.gradient} mb-3`}>
                  <item.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="font-display text-xl font-bold">{item.value}</div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </motion.div>
            ))}
          </div>

          {/* XP Progress */}
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">XP Progress</span>
              <span className="text-sm text-muted-foreground">
                {(profile?.xp || 0) % 100} / 100 to Level {(profile?.level || 1) + 1}
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-xp"
                initial={{ width: 0 }}
                animate={{ width: `${((profile?.xp || 0) % 100)}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Edit Profile */}
          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Edit Profile</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="@username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={50}
                />
              </div>

              <Button 
                onClick={handleSave} 
                variant="hero" 
                className="w-full"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Email Info */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user?.email}</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
