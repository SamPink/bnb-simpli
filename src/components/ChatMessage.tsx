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
        "max-w-[85%] rounded-xl p-6",
        isUser 
          ? "bg-primary text-primary-foreground shadow-lg" 
          : "bg-card text-card-foreground border border-border shadow-sm",
      )}>
        <ReactMarkdown 
          className={cn(
            "prose prose-invert max-w-none",
            "prose-h1:text-xl prose-h1:font-semibold prose-h1:mb-4",
            "prose-h2:text-lg prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-4",
            "prose-h3:text-base prose-h3:font-medium prose-h3:mb-2 prose-h3:mt-3",
            "prose-p:my-2 prose-p:leading-relaxed",
            "prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4",
            "prose-li:my-1 prose-li:pl-1",
            "prose-strong:font-semibold",
            "prose-code:bg-muted/50 prose-code:p-1 prose-code:rounded prose-code:text-sm",
            isUser ? "prose-strong:text-primary-foreground" : "prose-strong:text-foreground"
          )}
        >
          {content}
        </ReactMarkdown>
        
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