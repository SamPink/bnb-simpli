import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getChatSessions } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

interface ChatSession {
  session_id: string;
  created_at: string;
}

export const ChatSidebar = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchChatSessions(user.id);
      }
    };
    fetchUserId();
  }, []);

  const fetchChatSessions = async (uid: string) => {
    try {
      const sessions = await getChatSessions(uid);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-64 border-r border-border bg-card p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold">S</span>
        </div>
        <span className="font-semibold">Simpli</span>
      </div>
      
      <Button variant="ghost" className="justify-start gap-2">
        <LayoutGrid className="h-4 w-4" />
        Agents
      </Button>
      
      <Button variant="ghost" className="justify-start gap-2">
        <MessageSquare className="h-4 w-4" />
        All Chats
      </Button>

      <div className="mt-4">
        <div className="text-sm font-medium text-muted-foreground mb-2">Chat History</div>
        <div className="space-y-1">
          {chatSessions.map((session) => (
            <Button
              key={session.session_id}
              variant="ghost"
              className="w-full justify-start text-sm font-normal h-auto py-2"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-muted-foreground">
                  {formatDate(session.created_at)}
                </span>
                <span className="truncate w-full">
                  Chat {session.session_id.slice(0, 8)}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};