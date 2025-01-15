import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StarRatingProps {
  messageId: string;
  sessionId: string;
  aiMessage: string;
  userMessage?: string;
}

export const StarRating = ({ messageId, sessionId, aiMessage, userMessage }: StarRatingProps) => {
  const [ratings, setRatings] = useState<Record<string, number | null>>({});
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const currentRating = ratings[messageId] || null;

  const handleRating = async (selectedRating: number) => {
    if (isSubmitting || currentRating !== null) return;
    
    setIsSubmitting(true);
    console.log('Submitting rating for message:', messageId, 'Rating:', selectedRating);
    console.log('User message being submitted:', userMessage);

    try {
      // Get API token from Supabase Function
      const { data, error } = await supabase.functions.invoke('get-api-token', {
        body: { name: 'API_TOKEN' }
      });

      if (error) {
        console.error('Error fetching API token:', error);
        throw new Error('Failed to get API token');
      }

      // Call the feedback endpoint with the API token
      const response = await fetch('https://d892-2a02-c7c-d4e8-f300-6dee-b3fa-8bc1-7d8.ngrok-free.app/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '1',
          'X-API-Token': data.secret,
        },
        body: JSON.stringify({
          user_id: messageId,
          session_id: sessionId,
          user_message: userMessage || '',
          ai_message: aiMessage,
          rating: selectedRating,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit rating');
      }

      setRatings(prev => ({
        ...prev,
        [messageId]: selectedRating
      }));
      
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
      // Reset rating state on error
      setRatings(prev => ({
        ...prev,
        [messageId]: null
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-1 mt-4" data-message-id={messageId}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRating(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(null)}
          disabled={currentRating !== null || isSubmitting}
          className={cn(
            "transition-all duration-200",
            currentRating || hoveredRating 
              ? "hover:scale-110 active:scale-95" 
              : "opacity-50 hover:opacity-100",
            "disabled:cursor-not-allowed"
          )}
          aria-label={`Rate ${star} stars`}
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <Star
              className={cn(
                "w-5 h-5",
                (hoveredRating !== null ? star <= hoveredRating : star <= (currentRating || 0))
                  ? "fill-primary text-primary"
                  : "fill-none text-muted-foreground"
              )}
            />
          )}
        </button>
      ))}
      {currentRating && (
        <span className="ml-2 text-sm text-muted-foreground">
          Thank you for your feedback!
        </span>
      )}
    </div>
  );
};