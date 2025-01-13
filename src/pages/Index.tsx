import { useState, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ChatSidebar } from "@/components/ChatSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { getChatSessions, getChatHistory } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

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
  userId?: string;
  runId?: string;
  pdfPath?: string | null;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { content: "Hello! How can I assist you today?", isUser: false },
  ]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const handleSendMessage = (
    userMessage: string, 
    apiResponse: string, 
    sources: Source[] = [], 
    runId: string, 
    pdfPath: string | null = null
  ) => {
    if (!userId) return;

    setMessages((prev) => [
      ...prev,
      { content: userMessage, isUser: true },
      { 
        content: apiResponse, 
        isUser: false, 
        sources, 
        userId, 
        runId,
        pdfPath
      }
    ]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      <ChatSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-border">
          <h1 className="text-xl font-semibold">Agents</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive gap-2"
            onClick={handleLogout}
          >
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