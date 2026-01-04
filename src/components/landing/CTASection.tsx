import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Rocket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-hero opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-hero mb-8 animate-float">
          <Rocket className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
          Ready to Start <span className="text-gradient-hero">Winning</span>?
        </h2>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join thousands of people who are transforming their lives through small, consistent wins. Your future self will thank you.
        </p>
        
        <Link to="/auth">
          <Button variant="hero" size="xl" className="group">
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        
        <p className="mt-6 text-sm text-muted-foreground">
          Free forever • No credit card required
        </p>
      </motion.div>
    </section>
  );
}
