import { client } from '../lib/slack-utils';


interface BuildCommandParams {
  text: string;
  responseUrl: string;
  channelId: string;
  userId: string;
}

export async function handleBuildCommand({
  text,
  responseUrl,
  channelId,
  userId
}: BuildCommandParams) {
  try {
    // Validate input
    if (!text.trim()) {
      await client.chat.postEphemeral({
        channel: channelId,
        user: userId,
        text: 'Please provide a prompt. Usage: `/build your prompt here`'
      });
      return;
    }

    // Post initial processing message
    const initialResponse = await client.chat.postMessage({
      channel: channelId,
      text: `Processing your request: \`${text}\`...`
    });

    // Generate response using the AI SDK
    const aiResponse = await generateBuildResponse(text);

    // Post the AI response back to the channel
    await client.chat.postMessage({
      channel: channelId,
      thread_ts: initialResponse.ts,
      text: aiResponse
    });
  } catch (error) {
    console.error('Error handling build command:', error);
    
    // Notify the user of the error
    await client.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: `Error processing your request: ${error}`
    });
  }
}

async function generateBuildResponse(prompt: string) {
  try {
    // Use the existing AI completion function
    const  content  = 'ff'
    
    return content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}
