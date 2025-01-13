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
      "mb-4"
    )}>
      <div className={cn(
        "max-w-[85%] rounded-lg p-4",
        isUser ? "bg-primary text-primary-foreground" : "bg-card border border-border",
        "shadow-sm"
      )}>
        <ReactMarkdown 
          className={cn(
            "prose prose-invert max-w-none",
            "prose-headings:mb-2 prose-headings:mt-1 prose-headings:font-semibold",
            "prose-p:my-1 prose-p:leading-relaxed",
            "prose-li:my-0.5",
            "prose-strong:text-primary-foreground prose-strong:font-semibold",
            "prose-code:bg-muted prose-code:p-1 prose-code:rounded prose-code:text-sm",
            isUser ? "prose-strong:text-primary-foreground" : "prose-strong:text-foreground"
          )}
        >
          {content}
        </ReactMarkdown>
        
        {!isUser && sources.length > 0 && userId && runId && (
          <div className="mt-3 pt-3 border-t border-border">
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