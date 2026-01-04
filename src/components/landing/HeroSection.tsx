import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Flame, Trophy, Sparkles, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-xp/5 blur-3xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-secondary-foreground">AI-Powered Motivation</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          Build Habits with{' '}
          <span className="text-gradient-hero">Small Wins</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Transform your life one micro-goal at a time. AI-powered motivation keeps you on track and celebrates every victory.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link to="/auth">
            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              <Zap className="w-5 h-5" />
              Start Winning Today
            </Button>
          </Link>
          <Link to="/auth?mode=signin">
            <Button variant="outline" size="xl" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl gradient-streak mx-auto mb-3">
              <Flame className="w-6 h-6 text-streak-foreground" />
            </div>
            <div className="text-3xl font-bold font-display text-foreground mb-1">7 Days</div>
            <div className="text-sm text-muted-foreground">to build momentum</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl gradient-success mx-auto mb-3">
              <Target className="w-6 h-6 text-success-foreground" />
            </div>
            <div className="text-3xl font-bold font-display text-foreground mb-1">21 Days</div>
            <div className="text-sm text-muted-foreground">to form a habit</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl gradient-xp mx-auto mb-3">
              <Trophy className="w-6 h-6 text-xp-foreground" />
            </div>
            <div className="text-3xl font-bold font-display text-foreground mb-1">66 Days</div>
            <div className="text-sm text-muted-foreground">to make it automatic</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
