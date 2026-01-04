import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/pages/Dashboard';
import { supabase } from '@/integrations/supabase/client';

interface AIMotivationProps {
  profile: Profile | null;
  completedToday: number;
  totalHabits: number;
}

export function AIMotivation({ profile, completedToday, totalHabits }: AIMotivationProps) {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show motivation after a short delay
    const timer = setTimeout(() => {
      setVisible(true);
      fetchMotivation();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const fetchMotivation = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-motivation', {
        body: {
          level: profile?.level || 1,
          streak: profile?.current_streak || 0,
          completedToday,
          totalHabits,
          totalWins: profile?.total_wins || 0,
        },
      });

      if (!error && data?.message) {
        setMessage(data.message);
      } else {
        // Fallback messages
        const fallbacks = [
          "Every small win builds unstoppable momentum! 🔥",
          "You're doing amazing! Keep up the great work! 💪",
          "Progress isn't about perfection—it's about persistence! ⭐",
          "Today is another chance to become better! 🚀",
          "Small steps lead to big transformations! ✨",
        ];
        setMessage(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
      }
    } catch {
      setMessage("You've got this! Every habit completed is a victory! 🏆");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 gradient-hero opacity-10 blur-3xl" />
        
        <div className="relative z-10 flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-display font-semibold text-lg">AI Motivation</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-xp/20 text-xp font-medium">Powered by AI</span>
            </div>
            
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Getting your motivation...</span>
              </div>
            ) : (
              <p className="text-foreground text-lg leading-relaxed">{message}</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={fetchMotivation}
            disabled={loading}
            className="flex-shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
