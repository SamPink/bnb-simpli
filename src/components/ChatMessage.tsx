import { cn } from "@/lib/utils";
import { ChatSources } from "./ChatSources";

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
    <div className={cn("space-y-2", isUser ? "ml-auto" : "mr-auto")}>
      <div 
        className={cn(
          "p-4 rounded-lg max-w-[80%]",
          "whitespace-pre-wrap break-words",
          isUser ? "ml-auto bg-primary text-primary-foreground" : "mr-auto bg-card border border-border"
        )}
      >
        {content}
      </div>
      {!isUser && sources.length > 0 && userId && runId && (
        <ChatSources
          sources={sources}
          userId={userId}
          runId={runId}
          pdfPath={pdfPath}
        />
      )}
    </div>
  );
};