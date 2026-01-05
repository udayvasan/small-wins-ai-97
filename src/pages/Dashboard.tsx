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

/* ================= IST DATE HELPER ================= */
const getISTDate = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  return istTime.toISOString().split('T')[0]; // YYYY-MM-DD
};

/* ================= TYPES ================= */
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
  last_streak_date: string | null;
}

/* ================= DASHBOARD ================= */
export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddHabit, setShowAddHabit] = useState(false);

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=signin');
    }
  }, [user, authLoading, navigate]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const today = getISTDate();

      /* Fetch profile */
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileData) setProfile({
        ...profileData,
        last_streak_date: profileData.last_streak_date ?? null,
      });

      /* Fetch habits */
      const { data: habitsData } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      /* Fetch today completions */
      const { data: completionsData } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('completed_at', today);

      const completedIds = new Set(
        completionsData?.map(c => c.habit_id) || []
      );

      setHabits(
        (habitsData || []).map(h => ({
          ...h,
          completedToday: completedIds.has(h.id),
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD HABIT ================= */
  const handleAddHabit = async (habit: {
    name: string;
    description: string;
    icon: string;
  }) => {
    if (!user) return;

    const { data } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        name: habit.name,
        description: habit.description || null,
        icon: habit.icon,
      })
      .select()
      .single();

    if (data) {
      setHabits([{ ...data, completedToday: false }, ...habits]);
    }

    setShowAddHabit(false);
  };

  /* ================= COMPLETE HABIT ================= */
  const handleCompleteHabit = async (habitId: string) => {
    if (!user || !profile) return;

    const today = getISTDate();
    const habit = habits.find(h => h.id === habitId);

    /* -------- UNCOMPLETE -------- */
    if (habit?.completedToday) {
      await supabase
        .from('habit_completions')
        .delete()
        .eq('habit_id', habitId)
        .eq('completed_at', today);

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

    /* -------- COMPLETE -------- */
    else {
      await supabase.from('habit_completions').insert({
        habit_id: habitId,
        user_id: user.id,
        completed_at: today,
      });

      const alreadyCountedToday = profile.last_streak_date === today;

      let newCurrentStreak = profile.current_streak;
      let newLongestStreak = profile.longest_streak;

      if (!alreadyCountedToday) {
        newCurrentStreak += 1;
        newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
      }

      const newXp = profile.xp + 10;
      const newLevel = Math.floor(newXp / 100) + 1;

      await supabase
        .from('profiles')
        .update({
          total_wins: profile.total_wins + 1,
          xp: newXp,
          level: newLevel,
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          last_streak_date: alreadyCountedToday
            ? profile.last_streak_date
            : today,
        })
        .eq('user_id', user.id);

      setProfile({
        ...profile,
        total_wins: profile.total_wins + 1,
        xp: newXp,
        level: newLevel,
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_streak_date: alreadyCountedToday
          ? profile.last_streak_date
          : today,
      });
    }

    setHabits(habits.map(h =>
      h.id === habitId
        ? { ...h, completedToday: !h.completedToday }
        : h
    ));
  };

  /* ================= DELETE HABIT ================= */
  const handleDeleteHabit = async (habitId: string) => {
    await supabase.from('habits').delete().eq('id', habitId);
    setHabits(habits.filter(h => h.id !== habitId));
  };

  /* ================= LOADING ================= */
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader profile={profile} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <StatsCards profile={profile} habits={habits} />

          <AIMotivation
            profile={profile}
            completedToday={habits.filter(h => h.completedToday).length}
            totalHabits={habits.length}
          />

          <div className="mt-8">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Today's Habits</h2>
              <Button onClick={() => setShowAddHabit(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Habit
              </Button>
            </div>

            <AnimatePresence>
              {habits.length === 0 ? (
                <motion.div className="p-12 text-center">
                  <p>No habits yet</p>
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
