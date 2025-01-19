import { supabase } from "@/integrations/supabase/client";

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

const getApiHeaders = async () => {
  const apiKey = 'bnb_api_fserkjgsewnrupigiopvfghp9845ysut98guys93ur0945yu3ur0945yu4we90u509tuabuoiewjhgnriteugh';
  if (!apiKey) {
    throw new Error('API key not found in environment variables');
  }
  
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-API-Key': apiKey.trim()
  };

  console.log('[DEBUG] API Headers:', {
    ...headers,
    'X-API-Key': headers['X-API-Key'].substring(0, 10) + '...' // Log partial key for security
  });
  
  return headers;
};

export const sendChatMessage = async (message: string, userId: string, runId: string): Promise<ChatResponse> => {
  console.log('Sending chat message:', { message, userId, runId });
  
  const headers = await getApiHeaders();
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      ...headers
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
  
  // API now returns sources directly in the expected format
  console.log('[DEBUG] Processing API response:', {
    responseLength: data.response.length,
    sourcesCount: data.sources?.length || 0,
    hasPdfPath: !!data.pdf_path
  });

  return {
    response: data.response,
    sources: data.sources || [],
    pdf_path: data.pdf_path
  };
};

export const getChatSessions = async (userId: string): Promise<ChatSession[]> => {
  console.log('Fetching chat sessions for user:', userId);
  
  const headers = await getApiHeaders();
  const response = await fetch(`${API_BASE_URL}/chats?user_id=${userId}`, {
    headers,
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
  
  const headers = await getApiHeaders();
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}?user_id=${userId}`, {
    headers,
  });

  if (!response.ok) {
    console.error('Get chat history error:', response.status, response.statusText);
    throw new Error('Failed to fetch chat history');
  }

  const data = await response.json();
  if (!data || !data.history || !Array.isArray(data.history)) {
    console.error('Invalid chat history response:', data);
    return [];
  }

  console.log('Chat history response:', {
    raw: data,
    history: data.history,
    historyLength: data.history.length,
    firstMessage: data.history[0] || null,
  });
  
  // API now returns messages with sources directly in the expected format
  return data.history.map((msg, index) => {
    console.log(`[DEBUG] Processing history message ${index}:`, {
      role: msg.role,
      contentLength: msg.content.length,
      sourcesCount: msg.sources?.length || 0,
      hasPdfPath: !!msg.pdf_path
    });

    return {
      ...msg,
      sources: msg.sources || []
    };
  });
};

export const downloadSourcePdf = async (userId: string, runId: string, document: string): Promise<Blob> => {
  console.log('[DEBUG] Initiating source PDF download:', { 
    userId, 
    runId, 
    document,
    encodedDocument: encodeURIComponent(document)
  });
  
  const headers = await getApiHeaders();
  const url = `${API_BASE_URL}/download_pdf?user_id=${userId}&run_id=${runId}&document=${encodeURIComponent(document)}`;
  
  console.log('[DEBUG] Making request to:', {
    url,
    headers: {
      ...headers,
      'X-API-Key': '(redacted)'
    }
  });

  const response = await fetch(url, {
    headers: {
      ...headers,
      'Accept': 'application/pdf'
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'No error details available');
    console.error('[ERROR] Source PDF download failed:', {
      status: response.status,
      statusText: response.statusText,
      errorDetails: errorText,
      document
    });
    throw new Error(`Failed to download source PDF: ${response.statusText}`);
  }

  const blob = await response.blob();
  console.log('[DEBUG] Source PDF downloaded successfully:', {
    document,
    blobSize: blob.size,
    blobType: blob.type
  });
  
  return blob;
};

// Helper function to consolidate source validation logic
export const validateSource = (source: any): source is Source => {
  if (!source || typeof source !== 'object') {
    console.log('[DEBUG] Invalid source object:', source);
    return false;
  }

  const requiredProps = ['document', 'page', 'paragraph', 'text'];
  const hasAllProps = requiredProps.every(prop => prop in source);
  
  if (!hasAllProps) {
    console.log('[DEBUG] Source missing required properties:', {
      source,
      missingProps: requiredProps.filter(prop => !(prop in source))
    });
    return false;
  }

  const page = Number(source.page);
  const paragraph = Number(source.paragraph);
  
  if (isNaN(page) || isNaN(paragraph)) {
    console.log('[DEBUG] Invalid numeric values in source:', { page, paragraph });
    return false;
  }

  return true;
};
