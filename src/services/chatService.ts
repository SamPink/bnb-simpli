import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface Source {
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

export interface ChatMessage {
  content: string;
  role: string;
  sources?: Source[];
  pdf_path?: string | null;
}

export const sendChatMessage = async (message: string, userId: string, runId: string) => {
  console.log('Sending chat message:', { message, userId, runId });
  
  const { data, error } = await supabase
    .from('messages')
    .insert({
      content: message,
      role: 'user',
      session_id: runId,
      sources: null,
      pdf_path: null
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }
  
  console.log('Message sent successfully:', data);
  return data;
};

export const getChatSessions = async (userId: string) => {
  console.log('Fetching chat sessions for user:', userId);
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching chat sessions:', error);
    throw error;
  }
  
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

  if (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
  
  console.log('Raw chat history data:', data);
  
  return data.map((msg: any) => ({
    content: msg.content,
    role: msg.role,
    sources: msg.sources as Source[] || [],
    pdf_path: msg.pdf_path
  }));
};

export const downloadPdf = async (userId: string, runId: string): Promise<Blob> => {
  // This is a placeholder since we don't have a pdfs table
  // You'll need to implement the actual PDF download logic
  throw new Error('PDF download not implemented');
};