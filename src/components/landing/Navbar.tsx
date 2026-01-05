import { Button } from '@/components/ui/button';
import { Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoogleTranslate } from '@/components/GoogleTranslate';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-streak flex items-center justify-center">
            <Flame className="w-5 h-5 text-streak-foreground" />
          </div>
          <span className="font-display text-xl font-bold">MicroWins</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <GoogleTranslate />
          <Link to="/auth?mode=signin">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/auth">
            <Button variant="default" size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
