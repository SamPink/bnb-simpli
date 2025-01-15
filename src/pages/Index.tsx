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
  messageId?: string;
  previousMessage?: string;
}

const WELCOME_MESSAGE: Message = {
  content: "This demo version provides an early showcase of the Brown & Brown Support Desk Agent. Please note the following:\n\n" +
           "• You can ask questions regarding Acturis user guides.\n" +
           "• View the responses generated by the AI agent.\n" +
           "• A file download feature is available for PDF documents containing the source of information.\n\n" +
           "Important: In this demo, some functionalities are disabled.",
  isUser: false,
  messageId: 'welcome-message',
  runId: 'welcome'
};

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentRunId, setCurrentRunId] = useState<string>(() => {
    // Try to get the runId from localStorage, or generate a new one
    const storedRunId = localStorage.getItem('currentRunId');
    console.log('Initial runId from storage:', storedRunId);
    return storedRunId || crypto.randomUUID();
  });
  const [isTyping, setIsTyping] = useState(false);

  // Persist runId to localStorage whenever it changes
  useEffect(() => {
    console.log('Persisting runId to storage:', currentRunId);
    localStorage.setItem('currentRunId', currentRunId);
  }, [currentRunId]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        console.log('User authenticated:', user.id);
        setUserId(user.id);
      }
    });
  }, []);

  const handleChatSelect = async (runId?: string) => {
    if (!userId) return;
    
    if (!runId) {
      // Starting a new conversation
      const newRunId = crypto.randomUUID();
      console.log('Starting new conversation with run ID:', newRunId);
      setCurrentRunId(newRunId);
      setMessages([WELCOME_MESSAGE]); // Keep welcome message only
      return;
    }
    
    console.log('Loading chat history for run ID:', runId);
    setCurrentRunId(runId);
    
    try {
      const history = await getChatHistory(runId, userId);
      console.log('Received chat history:', history);
      
      const formattedMessages: Message[] = history.map((msg, index) => ({
        content: msg.content,
        isUser: msg.role === 'user',
        sources: msg.sources,
        userId: userId,
        runId: runId,
        pdfPath: msg.pdf_path || null,
        messageId: `${runId}-${index}`,
        previousMessage: index > 0 ? history[index - 1].content : undefined
      }));
      
      setMessages([WELCOME_MESSAGE, ...formattedMessages]);
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
    
    const messageId = `${currentRunId}-${Date.now()}-user`;
    console.log('Adding user message:', { messageId, runId: currentRunId });
    
    setMessages(prev => [...prev, { 
      content: userMessage, 
      isUser: true,
      messageId,
      runId: currentRunId,
      userId
    }]);
  };

  const handleAIResponse = (
    apiResponse: string, 
    sources: Source[] = [], 
    _runId: string, // Ignore the runId from the response
    pdfPath: string | null = null
  ) => {
    if (!userId) return;
    
    const messageId = `${currentRunId}-${Date.now()}-ai`;
    const previousMessage = messages[messages.length - 1]?.content;
    
    console.log('Adding AI response:', { 
      messageId, 
      runId: currentRunId,
      hasPreviousMessage: !!previousMessage 
    });
    
    setMessages(prev => [
      ...prev,
      { 
        content: apiResponse, 
        isUser: false, 
        sources, 
        userId, 
        runId: currentRunId,
        pdfPath,
        messageId,
        previousMessage
      }
    ]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar 
        onChatSelect={handleChatSelect}
        selectedChat={currentRunId}
      />
      
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-border bg-card">
          <h1 className="text-2xl font-semibold">Brown & Brown Support Desk Agent</h1>
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
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.messageId || index}
              {...message}
              sessionId={message.runId}
              userId={userId || undefined}
              previousMessage={index > 0 ? messages[index - 1].content : undefined}
            />
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