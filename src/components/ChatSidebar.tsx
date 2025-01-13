import { Button } from "@/components/ui/button";
import { LayoutGrid, MessageSquare } from "lucide-react";

export const ChatSidebar = () => {
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
    </div>
  );
};