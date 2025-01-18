import { cn } from "@/lib/utils";
import { ChatSources } from "./ChatSources";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { StarRating } from "./StarRating";

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
  sessionId?: string;
  previousMessage?: string;
  messageId?: string;
}

export const ChatMessage = ({ 
  content, 
  isUser, 
  sources = [], 
  userId, 
  runId, 
  pdfPath,
  sessionId,
  previousMessage,
  messageId
}: ChatMessageProps) => {
  // Enhanced debug logging for message rendering
  console.log('[DEBUG] ChatMessage render:', { 
    messageId,
    isUser, 
    userId, 
    sessionId,
    contentLength: content?.length,
    contentPreview: content?.substring(0, 50) + '...',
    sourcesProvided: !!sources,
    sourcesLength: sources?.length,
    sourcesValid: Array.isArray(sources) && sources.length > 0 && sources.every(source => 
      source && 
      typeof source === 'object' &&
      'document' in source &&
      'page' in source &&
      'paragraph' in source &&
      'text' in source
    ),
    hasPdfPath: !!pdfPath,
    hasRunId: !!runId,
    showStarRating: !isUser && sessionId && userId && messageId
  });

  // Only show star rating for AI messages when we have all required props and it's not the welcome message
  const showStarRating = !isUser && 
    Boolean(sessionId) && 
    Boolean(userId) && 
    Boolean(messageId) && 
    sessionId !== 'welcome' && 
    messageId !== 'welcome-message';

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
            "prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4",
            "prose-li:my-1 prose-li:pl-1",
            "prose-strong:font-semibold",
            "prose-code:bg-transparent prose-code:p-0 prose-code:text-sm",
            "prose-pre:p-0 prose-pre:bg-transparent",
            "prose-table:border-collapse prose-table:my-4",
            "prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted/50",
            "prose-td:border prose-td:border-border prose-td:p-2",
            isUser ? "prose-strong:text-primary-foreground" : "prose-strong:text-foreground"
          )}
          remarkPlugins={[remarkGfm]}
          components={{
            code({inline, className, children, ...props}: {
              inline?: boolean;
              className?: string;
              children: React.ReactNode;
            }) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              
              if (!inline && language) {
                return (
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: '1em 0',
                      borderRadius: '0.5rem',
                      padding: '1em'
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              }
              
              return (
                <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
        
        {/* Render sources for AI messages if valid sources exist */}
        {!isUser && userId && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <ChatSources
              sources={sources || []}
              userId={userId}
              runId={sessionId || runId}
              pdfPath={pdfPath}
            />
          </div>
        )}

        {showStarRating && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <StarRating
              messageId={messageId}
              sessionId={sessionId}
              aiMessage={content}
              userMessage={previousMessage}
              userId={userId}
            />
          </div>
        )}
      </div>
    </div>
  );
};
