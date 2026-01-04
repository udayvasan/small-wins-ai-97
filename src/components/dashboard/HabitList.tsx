import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Habit } from '@/pages/Dashboard';
import confetti from 'canvas-confetti';

interface HabitListProps {
  habits: Habit[];
  onComplete: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

export function HabitList({ habits, onComplete, onDelete }: HabitListProps) {
  const handleComplete = (habit: Habit) => {
    if (!habit.completedToday) {
      // Trigger confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#ef4444', '#8b5cf6', '#10b981'],
      });
    }
    onComplete(habit.id);
  };

  return (
    <div className="space-y-3">
      {habits.map((habit, index) => (
        <motion.div
          key={habit.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`glass-card p-4 flex items-center gap-4 group transition-all duration-300 ${
            habit.completedToday ? 'bg-success/10 border-success/30' : ''
          }`}
        >
          {/* Complete button */}
          <button
            onClick={() => handleComplete(habit)}
            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              habit.completedToday
                ? 'gradient-success shadow-success animate-celebrate'
                : 'bg-muted hover:bg-primary/20 hover:scale-105'
            }`}
          >
            {habit.completedToday ? (
              <Check className="w-6 h-6 text-success-foreground" />
            ) : (
              <span className="text-2xl">{habit.icon}</span>
            )}
          </button>

          {/* Habit info */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold truncate ${habit.completedToday ? 'line-through text-muted-foreground' : ''}`}>
              {habit.name}
            </h3>
            {habit.description && (
              <p className="text-sm text-muted-foreground truncate">{habit.description}</p>
            )}
          </div>

          {/* Status */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {habit.completedToday && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm font-medium text-success px-3 py-1 rounded-full bg-success/20"
              >
                +10 XP
              </motion.span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(habit.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
