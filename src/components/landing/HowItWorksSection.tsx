import { motion } from 'framer-motion';
import { Plus, Check, Gift, Repeat } from 'lucide-react';

const steps = [
  {
    icon: Plus,
    title: 'Create Habits',
    description: 'Add the habits you want to build. Start small - micro-goals are the secret.',
    number: '01',
  },
  {
    icon: Check,
    title: 'Complete Daily',
    description: 'Check off your habits each day. Every completion is a small win!',
    number: '02',
  },
  {
    icon: Gift,
    title: 'Get Motivated',
    description: 'AI sends you personalized encouragement and celebrates your progress.',
    number: '03',
  },
  {
    icon: Repeat,
    title: 'Build Momentum',
    description: 'Watch your streaks grow and level up. Small wins compound into big changes.',
    number: '04',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-gradient-hero">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, effective, and designed to keep you winning every single day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-glow">
                    <step.icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
