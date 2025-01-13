import { useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ChatSidebar } from "@/components/ChatSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface Message {
  content: string;
  isUser: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    { content: "Hello! How can I assist you today?", isUser: false },
  ]);

  const handleSendMessage = (content: string) => {
    setMessages((prev) => [...prev, { content, isUser: true }]);
    // Simulate agent response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { content: "Hello! How can I assist you today?", isUser: false },
      ]);
    }, 1000);
  };

  return (
    <div className="flex h-screen">
      <ChatSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-border">
          <h1 className="text-xl font-semibold">Agents</h1>
          <Button variant="ghost" size="sm" className="text-destructive gap-2">
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} {...message} />
          ))}
        </div>
        
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Index;