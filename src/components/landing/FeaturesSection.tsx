import { motion } from 'framer-motion';
import { Brain, Flame, Target, Trophy, Sparkles, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Micro-Goals',
    description: 'Break big habits into tiny, achievable wins that build unstoppable momentum.',
    gradient: 'gradient-primary',
  },
  {
    icon: Brain,
    title: 'AI Motivation',
    description: 'Get personalized encouragement from AI that understands your journey and celebrates with you.',
    gradient: 'gradient-xp',
  },
  {
    icon: Flame,
    title: 'Streak System',
    description: 'Build powerful streaks that keep you motivated. Don\'t break the chain!',
    gradient: 'gradient-streak',
  },
  {
    icon: Trophy,
    title: 'Level Up',
    description: 'Earn XP for every win. Level up your character as you level up your life.',
    gradient: 'gradient-success',
  },
  {
    icon: Sparkles,
    title: 'Celebrations',
    description: 'Every small win deserves a celebration. Watch confetti fly as you conquer goals.',
    gradient: 'gradient-hero',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Beautiful visualizations show your growth over time. See how far you\'ve come.',
    gradient: 'gradient-primary',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to <span className="text-gradient-primary">Win</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with science-backed techniques and gamification to make habit building actually fun.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
