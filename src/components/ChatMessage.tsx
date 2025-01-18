import { cn } from "@/lib/utils";
import { ChatSources } from "./ChatSources";
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
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
        "max-w-[85%] rounded-xl px-6 py-4",
        isUser 
          ? "bg-primary text-primary-foreground shadow-lg" 
          : "bg-card text-card-foreground border border-border shadow-sm",
      )}>
        <div 
          className={cn(
            "text-base leading-7",
            "space-y-4",
            "[&_ul]:list-disc [&_ul]:pl-8 [&_ul]:space-y-2",
            "[&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:space-y-2",
            "[&_li]:text-white",
            "[&_p]:my-0",
            "[&_pre]:p-4 [&_pre]:rounded-md [&_pre]:my-4 [&_pre]:overflow-auto",
            "[&_code]:font-mono [&_code]:text-sm [&_code:not(:has(pre))]:bg-[#1E1E1E] [&_code:not(:has(pre))]:px-1.5 [&_code:not(:has(pre))]:py-0.5 [&_code:not(:has(pre))]:rounded",
            "[&_table]:w-full [&_table]:my-4",
            "[&_th]:text-left [&_th]:p-2 [&_th]:bg-[#1E1E1E]",
            "[&_td]:p-2 [&_td]:border-t [&_td]:border-[#1E1E1E]"
          )}
          dangerouslySetInnerHTML={{ 
            __html: (() => {
              marked.setOptions({
                gfm: true,
                breaks: true
              });
              
              // Set up syntax highlighting
              const renderer = new marked.Renderer();
              renderer.code = ({ text, lang }) => {
                const validLanguage = lang && hljs.getLanguage(lang);
                const highlighted = validLanguage 
                  ? hljs.highlight(text, { language: lang, ignoreIllegals: true }).value
                  : hljs.highlightAuto(text).value;
                return `<pre><code class="hljs ${lang || ''}">${highlighted}</code></pre>`;
              };
              
              return marked.parse(content, { renderer });
            })()
          }}
        />
        
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
