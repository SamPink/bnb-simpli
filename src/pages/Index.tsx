import { useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ChatSidebar } from "@/components/ChatSidebar";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState([]);
  
  const handleSendMessage = (message) => {
    setMessages([...messages, { content: message, isUser: true }]);
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
            />
          ))}
        </div>
        <div className="p-4 border-t">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Index;
