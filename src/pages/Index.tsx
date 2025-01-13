import { useState, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ChatSidebar } from "@/components/ChatSidebar";
import { TypingIndicator } from "@/components/TypingIndicator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { getChatHistory } from "@/services/chatService";
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
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const handleChatSelect = async (sessionId: string) => {
    if (!userId) return;
    
    console.log('Loading chat history for session:', sessionId);
    setSelectedChat(sessionId);
    
    try {
      const history = await getChatHistory(sessionId, userId);
      console.log('Received chat history:', history);
      
      const formattedMessages: Message[] = history.map(msg => ({
        content: msg.content,
        isUser: msg.role === 'user',
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    }
  };

  const handleUserMessage = (userMessage: string) => {
    if (!userId) return;
    setMessages(prev => [...prev, { content: userMessage, isUser: true }]);
  };

  const handleAIResponse = (
    apiResponse: string, 
    sources: Source[] = [], 
    runId: string, 
    pdfPath: string | null = null
  ) => {
    if (!userId) return;
    setMessages(prev => [
      ...prev,
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
      <ChatSidebar 
        onChatSelect={handleChatSelect}
        selectedChat={selectedChat || undefined}
      />
      
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
          {isTyping && <TypingIndicator />}
        </div>
        
        <ChatInput 
          onSendMessage={handleUserMessage}
          onResponse={handleAIResponse}
          setIsTyping={setIsTyping}
        />
      </div>
    </div>
  );
};

export default Index;