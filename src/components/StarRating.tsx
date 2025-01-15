import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface StarRatingProps {
  messageId: string;
  sessionId: string;
  aiMessage: string;
  userMessage?: string;
}

export const StarRating = ({ messageId, sessionId, aiMessage, userMessage }: StarRatingProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRating = async (selectedRating: number) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    console.log('Submitting rating:', selectedRating);

    try {
      const response = await fetch('https://d892-2a02-c7c-d4e8-f300-6dee-b3fa-8bc1-7d8.ngrok-free.app/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer testuser',
          'ngrok-skip-browser-warning': '1',
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
        throw new Error('Failed to submit rating');
      }

      setRating(selectedRating);
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
    }
  };

  return (
    <div className="flex items-center gap-1 mt-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRating(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(null)}
          disabled={rating !== null || isSubmitting}
          className={cn(
            "transition-all duration-200 disabled:cursor-default",
            rating || hoveredRating 
              ? "hover:scale-110 active:scale-95" 
              : "opacity-50 hover:opacity-100"
          )}
        >
          <Star
            className={cn(
              "w-5 h-5",
              (hoveredRating !== null ? star <= hoveredRating : star <= (rating || 0))
                ? "fill-primary text-primary"
                : "fill-none text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
};