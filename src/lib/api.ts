import { supabase } from "@/integrations/supabase/client";
import type { 
  ChatRequest, 
  ChatResponse, 
  RetrieveChatsResponse, 
  GetChatHistoryResponse,
  User
} from "@/types/api";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function getAuthHeaders() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    throw new Error('Not authenticated');
  }
  return {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1'
  };
}

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send message');
  }
  
  return response.json();
}

export async function getChats(userId: string): Promise<RetrieveChatsResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/chats?user_id=${userId}`, {
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get chats');
  }
  
  return response.json();
}

export async function getChatHistory(chatId: string, userId: string): Promise<GetChatHistoryResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/chats/${chatId}?user_id=${userId}`, {
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get chat history');
  }
  
  return response.json();
}

export async function downloadPdf(userId: string, runId: string): Promise<Blob> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/download_pdf?user_id=${userId}&run_id=${runId}`, {
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to download PDF');
  }
  
  return response.blob();
}

export async function getCurrentUser(): Promise<User> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/user`, {
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get user info');
  }
  
  return response.json();
}