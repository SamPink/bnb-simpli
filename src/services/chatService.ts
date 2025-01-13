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
}

interface ChatSession {
  session_id: string;
  created_at: string;
}

export const sendChatMessage = async (message: string, userId: string, runId: string): Promise<ChatResponse> => {
  console.log('Sending chat message:', { message, userId, runId });
  
  const response = await fetch('https://5c75-2a02-c7c-d4e8-f300-ec6e-966-f8c8-9def.ngrok-free.app/chat', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
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
  
  const response = await fetch(`https://5c75-2a02-c7c-d4e8-f300-ec6e-966-f8c8-9def.ngrok-free.app/chats?user_id=${userId}`, {
    headers: {
      'accept': 'application/json',
    },
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
  
  const response = await fetch(`https://5c75-2a02-c7c-d4e8-f300-ec6e-966-f8c8-9def.ngrok-free.app/chats/${chatId}?user_id=${userId}`, {
    headers: {
      'accept': 'application/json',
    },
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
  
  const response = await fetch(`https://5c75-2a02-c7c-d4e8-f300-ec6e-966-f8c8-9def.ngrok-free.app/download_pdf?user_id=${userId}&run_id=${runId}`, {
    headers: {
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