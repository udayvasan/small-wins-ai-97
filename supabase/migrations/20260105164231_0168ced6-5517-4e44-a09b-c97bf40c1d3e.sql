-- Add last_streak_date column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_streak_date DATE;