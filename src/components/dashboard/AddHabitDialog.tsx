import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (habit: { name: string; description: string; icon: string }) => void;
}

const icons = ['🎯', '💪', '📚', '🏃', '🧘', '💧', '🥗', '💤', '✍️', '🎸', '🧠', '❤️'];

export function AddHabitDialog({ open, onOpenChange, onAdd }: AddHabitDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎯');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({ name: name.trim(), description: description.trim(), icon: selectedIcon });
      setName('');
      setDescription('');
      setSelectedIcon('🎯');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Add New Habit</DialogTitle>
          <DialogDescription>
            Start small! Micro-habits are easier to stick with.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Icon selector */}
          <div className="space-y-2">
            <Label>Choose an icon</Label>
            <div className="flex flex-wrap gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all duration-200 ${
                    selectedIcon === icon
                      ? 'gradient-primary scale-110 shadow-glow'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="habitName">Habit name</Label>
            <Input
              id="habitName"
              placeholder="e.g., Drink a glass of water"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="habitDescription">Description (optional)</Label>
            <Textarea
              id="habitDescription"
              placeholder="Add more details about your habit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1" disabled={!name.trim()}>
              Add Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
