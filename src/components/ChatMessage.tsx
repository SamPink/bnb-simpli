import { cn } from "@/lib/utils";
import { ChatSources } from "./ChatSources";
import ReactMarkdown from 'react-markdown';

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

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  sources?: Source[];
  userId?: string;
  runId?: string;
  pdfPath?: string | null;
}

export const ChatMessage = ({ content, isUser, sources = [], userId, runId, pdfPath }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex w-full",
      isUser ? "justify-end" : "justify-start",
      "mb-6"
    )}>
      <div className={cn(
        "chat-bubble",
        isUser ? "user-message" : "agent-message"
      )}>
        <ReactMarkdown>{content}</ReactMarkdown>
        
        {!isUser && sources.length > 0 && userId && runId && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <ChatSources
              sources={sources}
              userId={userId}
              runId={runId}
              pdfPath={pdfPath}
            />
          </div>
        )}
      </div>
    </div>
  );
};