import { useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ChatSidebar } from "@/components/ChatSidebar";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

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

interface Message {
  content: string;
  isUser: boolean;
  sources?: Source[];
  runId?: string;
  pdfPath?: string | null;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const handleSendMessage = (message: string) => {
    setMessages([...messages, { content: message, isUser: true }]);
  };

  const handleResponse = (response: string, sources: Source[], runId: string, pdfPath: string | null) => {
    setMessages([...messages, { 
      content: response, 
      isUser: false, 
      sources, 
      runId,
      pdfPath 
    }]);
  };

  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-semibold">Chat</h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => {
              console.log("New chat clicked");
            }}
          >
            <MessageSquare className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <ChatMessage 
              key={index} 
              content={message.content} 
              isUser={message.isUser}
              sources={message.sources}
              runId={message.runId}
              pdfPath={message.pdfPath}
            />
          ))}
        </div>
        <ChatInput 
          onSendMessage={handleSendMessage}
          onResponse={handleResponse}
          setIsTyping={setIsTyping}
        />
      </div>
    </div>
  );
};

export default Index;