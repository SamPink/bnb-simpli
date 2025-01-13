export interface ChatRequest {
  message: string;
  user_id?: string | null;
  run_id?: string | null;
}

export interface Metadata {
  size: number;
  last_modified: string;
  file_type: string;
}

export interface Source {
  document: string;
  page: number;
  paragraph: number;
  text: string;
  metadata: Metadata;
}

export interface ChatResponse {
  response: string;
  sources: Source[];
  pdf_path: string | null;
}

export interface ErrorResponse {
  error: string;
}

export interface ChatSession {
  session_id: string;
  created_at: string;
}

export interface RetrieveChatsResponse {
  chats: ChatSession[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GetChatHistoryResponse {
  chat_id: string;
  history: ChatMessage[];
}

export interface User {
  username: string;
  email: string;
  full_name: string;
  disabled: boolean;
}