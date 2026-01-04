import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { HabitList } from '@/components/dashboard/HabitList';
import { AddHabitDialog } from '@/components/dashboard/AddHabitDialog';
import { AIMotivation } from '@/components/dashboard/AIMotivation';
import { Plus, Loader2 } from 'lucide-react';

export interface Habit {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  frequency: string;
  target_count: number;
  created_at: string;
  completedToday?: boolean;
}

export interface Profile {
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

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddHabit, setShowAddHabit] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=signin');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch habits with today's completions
      const today = new Date().toISOString().split('T')[0];
      const { data: habitsData } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data: completionsData } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('completed_at', today);

      const completedIds = new Set(completionsData?.map(c => c.habit_id) || []);
      
      const habitsWithCompletion = (habitsData || []).map(habit => ({
        ...habit,
        completedToday: completedIds.has(habit.id),
      }));

      setHabits(habitsWithCompletion);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (habit: { name: string; description: string; icon: string }) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        name: habit.name,
        description: habit.description || null,
        icon: habit.icon,
      })
      .select()
      .single();

    if (!error && data) {
      setHabits([{ ...data, completedToday: false }, ...habits]);
    }
    setShowAddHabit(false);
  };

  const handleCompleteHabit = async (habitId: string) => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const habit = habits.find(h => h.id === habitId);
    
    if (habit?.completedToday) {
      // Uncomplete
      await supabase
        .from('habit_completions')
        .delete()
        .eq('habit_id', habitId)
        .eq('completed_at', today);

      // Update XP (remove 10)
      if (profile) {
        await supabase
          .from('profiles')
          .update({
            total_wins: Math.max(0, profile.total_wins - 1),
            xp: Math.max(0, profile.xp - 10),
          })
          .eq('user_id', user.id);
        
        setProfile({
          ...profile,
          total_wins: Math.max(0, profile.total_wins - 1),
          xp: Math.max(0, profile.xp - 10),
        });
      }
    } else {
      // Complete
      await supabase
        .from('habit_completions')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          completed_at: today,
        });

      // Update XP (add 10)
      if (profile) {
        const newXp = profile.xp + 10;
        const newLevel = Math.floor(newXp / 100) + 1;
        
        await supabase
          .from('profiles')
          .update({
            total_wins: profile.total_wins + 1,
            xp: newXp,
            level: newLevel,
            current_streak: profile.current_streak + 1,
            longest_streak: Math.max(profile.longest_streak, profile.current_streak + 1),
          })
          .eq('user_id', user.id);
        
        setProfile({
          ...profile,
          total_wins: profile.total_wins + 1,
          xp: newXp,
          level: newLevel,
          current_streak: profile.current_streak + 1,
          longest_streak: Math.max(profile.longest_streak, profile.current_streak + 1),
        });
      }
    }

    setHabits(habits.map(h => 
      h.id === habitId ? { ...h, completedToday: !h.completedToday } : h
    ));
  };

  const handleDeleteHabit = async (habitId: string) => {
    await supabase.from('habits').delete().eq('id', habitId);
    setHabits(habits.filter(h => h.id !== habitId));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader profile={profile} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatsCards profile={profile} habits={habits} />
          
          <AIMotivation 
            profile={profile} 
            completedToday={habits.filter(h => h.completedToday).length}
            totalHabits={habits.length}
          />

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">Today's Habits</h2>
              <Button onClick={() => setShowAddHabit(true)} variant="default">
                <Plus className="w-4 h-4" />
                Add Habit
              </Button>
            </div>

            <AnimatePresence>
              {habits.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-12 text-center"
                >
                  <div className="w-20 h-20 rounded-3xl gradient-primary mx-auto mb-6 flex items-center justify-center">
                    <Plus className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">No habits yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start building your first habit. Remember, small wins lead to big changes!
                  </p>
                  <Button onClick={() => setShowAddHabit(true)} variant="hero">
                    Create Your First Habit
                  </Button>
                </motion.div>
              ) : (
                <HabitList 
                  habits={habits} 
                  onComplete={handleCompleteHabit}
                  onDelete={handleDeleteHabit}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      <AddHabitDialog 
        open={showAddHabit} 
        onOpenChange={setShowAddHabit}
        onAdd={handleAddHabit}
      />
    </div>
  );
}
