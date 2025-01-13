interface ChatResponse {
  response: string;
  sources: {
    document: string;
    page: number;
    paragraph: number;
    text: string;
    metadata: {
      size: number;
      last_modified: string;
      file_type: string;
    };
  }[];
  pdf_path: string;
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