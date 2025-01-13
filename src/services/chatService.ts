import { supabase } from "@/integrations/supabase/client";

interface ChatHistoryMessage {
  content: string;
  role: string;
  sources?: any[];
  pdf_path?: string | null;
}

export const sendChatMessage = async (message: string, userId: string, runId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ content: message, user_id: userId, session_id: runId }])
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
  return data;
};

export const getChatHistory = async (sessionId: string, userId: string) => {
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
    sources: msg.sources || [],
    pdf_path: msg.pdf_path
  }));
};

export const downloadPdf = async (userId: string, runId: string) => {
  const { data, error } = await supabase
    .from('pdfs')
    .select('file')
    .eq('user_id', userId)
    .eq('run_id', runId)
    .single();

  if (error) throw error;
  return data.file;
};
