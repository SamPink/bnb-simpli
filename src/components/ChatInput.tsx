import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { sendChatMessage } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Source {
  document: string;
  page: number;
  paragraph: number;
  text: string;
  metadata: {
    size: number;
    last_modified: string;
    file_type: string;
  };
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onResponse: (response: string, sources: Source[], runId: string, pdfPath: string | null) => void;
  setIsTyping: (isTyping: boolean) => void;
}

export const ChatInput = ({ onSendMessage, onResponse, setIsTyping }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !userId) return;

    const currentMessage = message.trim(); // Store message before clearing
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      // Immediately show user message and pass it through
      onSendMessage(currentMessage);
      
      let runId = localStorage.getItem('runId');
      if (!runId) {
        runId = crypto.randomUUID();
        localStorage.setItem('runId', runId);
      }
      const response = await sendChatMessage(currentMessage, userId, runId);
      
      // Add AI response after it's received, passing the user's message
      onResponse(response.response, response.sources, runId, response.pdf_path);
      setMessage("");
      // Store the runId in localStorage to persist across sessions
      localStorage.setItem('runId', runId);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-border">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter Text"
        className="flex-1 bg-muted"
        disabled={isLoading || !userId}
      />
      <Button type="submit" size="icon" disabled={isLoading || !userId}>
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  );
};
