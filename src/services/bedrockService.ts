import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

// Initialize the Bedrock client
export const bedrockClient = new AnthropicBedrock({
  // Credentials will be automatically loaded from AWS credential providers
  // This includes environment variables, AWS CLI credentials, or IAM roles
  awsRegion: 'us-west-2', // Update this to your desired region
});

export interface MessageRequest {
  content: string;
  maxTokens?: number;
}

export async function sendMessage({ content, maxTokens = 256 }: MessageRequest) {
  try {
    const message = await bedrockClient.messages.create({
      model: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content }]
    });
    return message;
  } catch (error) {
    console.error('Error calling Bedrock:', error);
    throw error;
  }
}
