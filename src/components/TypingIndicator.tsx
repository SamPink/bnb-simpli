import { cn } from "@/lib/utils";

export const TypingIndicator = () => {
  return (
    <div className={cn("space-y-2 mr-auto")}>
      <div className="p-4 rounded-lg max-w-[80%] mr-auto bg-muted flex gap-2 items-center">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <span className="text-sm text-muted-foreground">AI is typing...</span>
      </div>
    </div>
  );
};