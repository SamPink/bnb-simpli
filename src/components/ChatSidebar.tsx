import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, HelpCircle, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getChatSessions } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ChatSession {
  id: string;  // Changed from session_id to match database schema
  created_at: string;
  title: string | null;
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

  return (
    <div className="w-80 border-r border-border bg-[#1C2127] flex flex-col h-full">
      {/* Top Logo */}
      <div className="p-4 border-b border-border flex justify-center">
        <img 
          src="https://brownandbrown.simpliautomation.com/assets/bravo-networks-logo-DMrGQqwm.png"
          alt="Bravo Networks Logo"
          className="h-12 object-contain"
        />
      </div>

      <div className="p-6 border-b border-border">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Demo Instructions</h2>
          <p className="text-sm text-gray-400">
            This demo version provides an early showcase of the Brown & Brown Support Desk Agent.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2 text-white">Quick Access</h3>
            <div className="space-y-1">
              <div className="space-y-1">
                {chatSessions.map((session) => (
                  <Button
                    key={session.id}
                    variant={selectedChat === session.id ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2 text-gray-300 hover:text-white"
                    onClick={() => onChatSelect?.(session.id)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat {format(new Date(session.created_at), 'MMM d, yyyy')}
                  </Button>
                ))}
              </div>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:text-white">
                <HelpCircle className="h-4 w-4" />
                Help & Support
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:text-white">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 text-white">Full Version Features</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Access to all chats and historical interactions</p>
              <p>• Help and Support pages for easy navigation</p>
              <p>• User account settings with profile management</p>
              <p>• Custom functionalities as per your requirements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-border mt-auto">
        <div className="flex items-center gap-2 mb-2">
          <img 
            src="https://brownandbrown.simpliautomation.com/assets/SimpliLogo.svg"
            alt="Simpli Logo"
            className="h-12 w-12"
          />
        </div>
        <p className="text-sm text-gray-400">© 2024 Simpli</p>
      </div>
    </div>
  );
};