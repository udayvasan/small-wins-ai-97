import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Flame, LogOut, User, Trophy, Zap } from 'lucide-react';
import { Profile } from '@/pages/Dashboard';

interface DashboardHeaderProps {
  profile: Profile | null;
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const xpToNextLevel = profile ? (profile.level * 100) - profile.xp : 0;
  const xpProgress = profile ? ((profile.xp % 100) / 100) * 100 : 0;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-streak flex items-center justify-center">
            <Flame className="w-5 h-5 text-streak-foreground" />
          </div>
          <span className="font-display text-xl font-bold">MicroWins</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Level indicator */}
          <motion.div 
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-card border border-border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-xp" />
              <span className="text-sm font-medium">Level {profile?.level || 1}</span>
            </div>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full gradient-xp"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{xpToNextLevel} XP to next</span>
          </motion.div>

          {/* Streak */}
          <motion.div 
            className="flex items-center gap-2 px-3 py-2 rounded-xl gradient-streak"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Flame className="w-4 h-4 text-streak-foreground animate-fire-pulse" />
            <span className="text-sm font-bold text-streak-foreground">{profile?.current_streak || 0}</span>
          </motion.div>

          {/* Profile */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/profile')}
          >
            <User className="w-5 h-5" />
          </Button>

          {/* Sign out */}
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
