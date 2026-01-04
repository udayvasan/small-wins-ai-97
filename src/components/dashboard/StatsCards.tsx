import { motion } from 'framer-motion';
import { Flame, Trophy, Target, Zap } from 'lucide-react';
import { Profile, Habit } from '@/pages/Dashboard';

interface StatsCardsProps {
  profile: Profile | null;
  habits: Habit[];
}

export function StatsCards({ profile, habits }: StatsCardsProps) {
  const completedToday = habits.filter(h => h.completedToday).length;
  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  const stats = [
    {
      icon: Trophy,
      label: 'Total Wins',
      value: profile?.total_wins || 0,
      gradient: 'gradient-primary',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: profile?.current_streak || 0,
      gradient: 'gradient-streak',
      suffix: ' days',
    },
    {
      icon: Target,
      label: 'Today',
      value: `${completedToday}/${habits.length}`,
      gradient: 'gradient-success',
      isProgress: true,
      progress: completionRate,
    },
    {
      icon: Zap,
      label: 'Total XP',
      value: profile?.xp || 0,
      gradient: 'gradient-xp',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="glass-card p-5"
        >
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.gradient} mb-3`}>
            <stat.icon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="font-display text-2xl font-bold">
            {stat.value}{stat.suffix}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
          {stat.isProgress && (
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-success"
                initial={{ width: 0 }}
                animate={{ width: `${stat.progress}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
