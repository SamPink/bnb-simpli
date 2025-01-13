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

interface ChatResponse {
  response: string;
  sources: Source[];
  pdf_path: string | null;
}

interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  pdf_path?: string | null;
}

interface ChatSession {
  session_id: string;
  created_at: string;
}

const API_BASE_URL = 'https://bnb.gentlesand-b0965d81.westeurope.azurecontainerapps.io';

const API_HEADERS = {
  'accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer testuser',
  'ngrok-skip-browser-warning': '1'
};

export const sendChatMessage = async (message: string, userId: string, runId: string): Promise<ChatResponse> => {
  console.log('Sending chat message:', { message, userId, runId });
  
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: API_HEADERS,
    body: JSON.stringify({
      message,
      run_id: runId,
      user_id: userId,
    }),
  });

  if (!response.ok) {
    console.error('Chat API error:', response.status, response.statusText);
    throw new Error('Failed to send message');
  }

  const data = await response.json();
  console.log('Chat API response:', data);
  return data;
};

export const getChatSessions = async (userId: string): Promise<ChatSession[]> => {
  console.log('Fetching chat sessions for user:', userId);
  
  const response = await fetch(`${API_BASE_URL}/chats?user_id=${userId}`, {
    headers: API_HEADERS,
  });

  if (!response.ok) {
    console.error('Get chats error:', response.status, response.statusText);
    throw new Error('Failed to fetch chat sessions');
  }

  const data = await response.json();
  console.log('Chat sessions response:', data);
  return data.chats;
};

export const getChatHistory = async (chatId: string, userId: string): Promise<ChatHistoryMessage[]> => {
  console.log('Fetching chat history:', { chatId, userId });
  
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}?user_id=${userId}`, {
    headers: API_HEADERS,
  });

  if (!response.ok) {
    console.error('Get chat history error:', response.status, response.statusText);
    throw new Error('Failed to fetch chat history');
  }

  const data = await response.json();
  console.log('Chat history response:', data);
  return data.history;
};

export const downloadPdf = async (userId: string, runId: string): Promise<Blob> => {
  console.log('Downloading PDF:', { userId, runId });
  
  const response = await fetch(`${API_BASE_URL}/download_pdf?user_id=${userId}&run_id=${runId}`, {
    headers: {
      ...API_HEADERS,
      'accept': 'application/pdf',
    },
  });

  if (!response.ok) {
    console.error('PDF download error:', response.status, response.statusText);
    throw new Error('Failed to download PDF');
  }

  const blob = await response.blob();
  console.log('PDF downloaded successfully');
  return blob;
};