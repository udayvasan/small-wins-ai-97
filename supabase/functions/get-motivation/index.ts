import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { level, streak, completedToday, totalHabits, totalWins } = await req.json();
    
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build context for AI
    let context = `User stats: Level ${level}, ${streak} day streak, ${totalWins} total wins.`;
    
    if (totalHabits > 0) {
      const progress = Math.round((completedToday / totalHabits) * 100);
      context += ` Today: ${completedToday}/${totalHabits} habits completed (${progress}%).`;
    } else {
      context += ` They just started and haven't added habits yet.`;
    }

    const prompt = `You are a motivational AI coach for a habit-tracking app called MicroWins. 
Your job is to provide short, personalized encouragement (1-2 sentences max).
Be warm, energetic, and celebrate their progress. Use emojis sparingly.
Focus on the power of small wins and building momentum.

${context}

Generate a unique, personalized motivational message:`;

    console.log('Generating motivation for:', { level, streak, completedToday, totalHabits });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content?.trim() || 
      "Keep going! Every small win counts! 🔥";

    console.log('Generated message:', message);

    return new Response(
      JSON.stringify({ message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating motivation:', error);
    
    // Return a fallback message
    const fallbacks = [
      "Every habit you complete is a victory! Keep winning! 🏆",
      "Small steps create big transformations. You've got this! 💪",
      "Your streak is building something amazing! 🔥",
      "Today's effort is tomorrow's success! Keep going! ⭐",
      "Consistency beats perfection. You're doing great! ✨",
    ];
    
    return new Response(
      JSON.stringify({ 
        message: fallbacks[Math.floor(Math.random() * fallbacks.length)] 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
