import { verifyRequest } from '../lib/slack-utils';
import { handleBuildCommand } from '../lib/handle-slash-command.ts';
import { waitUntil } from '@vercel/functions';

export const config = {
  runtime: 'edge',
};

export async function POST(req: Request) {
  const body = await req.text();

  // Parse the form data
  const formData = new URLSearchParams(body);
  
  // Verify the request is coming from Slack
    const isValid = await verifyRequest({ requestType: 'event_callback', request: req, rawBody: body });
  if (!isValid) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Extract the command data
  const command = formData.get('command');
  const text = formData.get('text') || '';
  const responseUrl = formData.get('response_url');
  const channelId = formData.get('channel_id');
  const userId = formData.get('user_id');
  
  // Only handle /build commands
  if (command !== '/build') {
    return new Response('Unknown command', { status: 200 });
  }

  // Acknowledge the command immediately to prevent timeout
  const response = new Response('Processing your request...', { status: 200 });
  
  // Process the command asynchronously
  waitUntil(
    handleBuildCommand({
      text,
      responseUrl: responseUrl || '',
      channelId: channelId || '',
      userId: userId || '',
    })
  );

  return response;
}
