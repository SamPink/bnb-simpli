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
  userId: string;
}

export const StarRating = ({ messageId, sessionId, aiMessage, userMessage, userId }: StarRatingProps) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  console.log('StarRating render:', {
    messageId,
    sessionId,
    userId,
    hasUserMessage: Boolean(userMessage),
    hasAiMessage: Boolean(aiMessage)
  });

  const handleRating = async (selectedRating: number) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    console.log('Submitting feedback:', {
      messageId,
      sessionId,
      userId,
      rating: selectedRating,
      hasUserMessage: Boolean(userMessage),
      hasAiMessage: Boolean(aiMessage)
    });

    try {
      const { error } = await supabase
        .from('message_feedback')
        .insert({
          user_id: userId,
          session_id: sessionId,
          user_message: userMessage || '',
          ai_message: aiMessage,
          rating: selectedRating,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Error submitting rating:', error);
        throw error;
      }
      
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
    } finally {
      setIsSubmitting(false);
      setHoveredRating(null);
    }
  };

  return (
    <div className="flex items-center gap-1" data-message-id={messageId}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRating(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(null)}
          disabled={isSubmitting}
          className={cn(
            "transition-all duration-200",
            hoveredRating 
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
                star <= (hoveredRating || 0)
                  ? "fill-primary text-primary"
                  : "fill-none text-muted-foreground"
              )}
            />
          )}
        </button>
      ))}
    </div>
  );
};