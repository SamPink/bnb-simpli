import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, HelpCircle, Settings, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getChatSessions } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ChatSession {
  session_id: string;
  created_at: string;
}

interface ChatSidebarProps {
  onChatSelect?: (sessionId: string) => void;
  selectedChat?: string;
}

export const ChatSidebar = ({ onChatSelect, selectedChat }: ChatSidebarProps) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('Current user:', user.id);
        setUserId(user.id);
        fetchChatSessions(user.id);
      }
    };
    fetchUserId();
  }, []);

  const fetchChatSessions = async (uid: string) => {
    try {
      console.log('Fetching chat sessions for user:', uid);
      const sessions = await getChatSessions(uid);
      console.log('Received chat sessions:', sessions);
      setChatSessions(sessions);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    }
  };

  const handleNewConversation = () => {
    onChatSelect?.(undefined);
  };

  return (
    <div className="w-80 border-r border-border bg-[#1C2127] flex flex-col h-full">
      {/* Top Logo */}
      <div className="p-4 border-b border-border flex justify-center items-center">
        <img 
          src="https://brownandbrown.simpliautomation.com/assets/bravo-networks-logo-DMrGQqwm.png"
          alt="Bravo Networks Logo"
          className="h-12 object-contain"
        />
      </div>

      {/* New Conversation Button and Description */}
      <div className="px-4 py-6 border-b border-border">
        <Button
          variant="default"
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-6"
          onClick={handleNewConversation}
        >
          <Plus className="h-5 w-5" />
          New Conversation
        </Button>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          This demo version provides an early showcase of the Brown & Brown Support Desk Agent.
        </p>
      </div>

      {/* Chat History and Quick Access */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3 text-foreground/90">Quick Access</h3>
            <div className="space-y-1">
              {chatSessions.map((session) => (
                <Button
                  key={session.session_id}
                  variant={selectedChat === session.session_id ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => onChatSelect?.(session.session_id)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat {format(new Date(session.created_at), 'MMM d, yyyy')}
                </Button>
              ))}
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              >
                <HelpCircle className="h-4 w-4" />
                Help & Support
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3 text-foreground/90">Full Version Features</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Access to all chats and historical interactions</p>
              <p>• Help and Support pages for easy navigation</p>
              <p>• User account settings with profile management</p>
              <p>• Custom functionalities as per your requirements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-2 mb-2">
          <img 
            src="https://brownandbrown.simpliautomation.com/assets/SimpliLogo.svg"
            alt="Simpli Logo"
            className="h-10 w-10"
          />
        </div>
        <p className="text-sm text-muted-foreground">© 2024 Simpli</p>
      </div>
    </div>
  );
};