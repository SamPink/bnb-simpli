import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

export const ChatMessage = ({ content, isUser }: ChatMessageProps) => {
  return (
    <div 
      className={cn(
        "p-4 rounded-lg max-w-[80%]",
        "whitespace-pre-wrap break-words",
        isUser ? "ml-auto bg-primary text-primary-foreground" : "mr-auto bg-muted"
      )}
    >
      {content}
    </div>
  );
};