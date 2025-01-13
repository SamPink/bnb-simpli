import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface ChatMessage {
  content: string;
  role: string;
  sources?: Json;
  pdf_path?: string | null;
}

export const sendChatMessage = async (message: string, userId: string, runId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      content: message,
      role: 'user',
      session_id: runId
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getChatSessions = async (userId: string) => {
  console.log('Fetching chat sessions for user:', userId);
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  console.log('Retrieved chat sessions:', data);
  return data;
};

export const getChatHistory = async (sessionId: string, userId: string): Promise<ChatMessage[]> => {
  console.log('Fetching chat history for session:', sessionId);
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  
  console.log('Raw chat history data:', data);
  return data.map((msg: any) => ({
    content: msg.content,
    role: msg.role,
    sources: msg.sources,
    pdf_path: msg.pdf_path
  }));
};

export const downloadPdf = async (userId: string, runId: string): Promise<Blob> => {
  // This is a placeholder since we don't have a pdfs table
  // You'll need to implement the actual PDF download logic
  throw new Error('PDF download not implemented');
};