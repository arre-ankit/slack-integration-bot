import type { SlackEvent } from "@slack/web-api";
import { waitUntil } from "@vercel/functions";
import { verifyRequest, getBotId } from "../lib/slack-utils";
import { handleNewAppMentionLangBase } from '../lib/handle-app-mention-langbase';
import { assistantThreadMessageLangbase, handleNewAssistantMessageLangbase } from '../lib/handle-message-langbase';

// Function to handle commands
async function handleCommand(event: SlackEvent, command: string, botUserId: string) {
  // Extract the command from the message
  switch (command.toLowerCase()) {
    case 'build':
      // Handle build command
      console.log("Build command received");
      // Implement your build functionality here
      return await handleBuildCommand(event);
    // Add more commands as needed
    case 'run':
      return await handleDeployCommand(event);
    case 'status':
      return await handleStatusCommand(event);
  }
}

// Implement command handlers
async function handleBuildCommand(event: SlackEvent) {
  // Build command implementation
  // You can add your build logic here
  console.log("Starting build process...");
  
  // Example: Send a message back to the channel
  // This would require you to have a function to send messages to Slack
  // For example: await sendSlackMessage(event.channel, "Starting build process...");
  
  return true;
}

async function handleDeployCommand(event: SlackEvent) {
  // Deploy command implementation
  console.log("Starting deployment process...");
  return true;
}

async function handleStatusCommand(event: SlackEvent) {
  // Status command implementation
  console.log("Checking status...");
  return true;
}

// Function to parse commands from message text
function parseCommand(text: string): string | null {
  // Look for text starting with '/'
  const commandMatch = text.match(/\/(\w+)/);
  return commandMatch ? commandMatch[1] : null;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const payload = JSON.parse(rawBody);
  const requestType = payload.type as "url_verification" | "event_callback";

  // See https://api.slack.com/events/url_verification
  if (requestType === "url_verification") {
    return new Response(payload.challenge, { status: 200 });
  }

  await verifyRequest({ requestType, request, rawBody });

  try {
    const botUserId = await getBotId();
    const event = payload.event as SlackEvent;

    if (event.type === "app_mention") {
      // Check if the mention contains a command
      const command = parseCommand(event.text);
      if (command) {
        waitUntil(handleCommand(event, command, botUserId));
      } else {
        waitUntil(handleNewAppMentionLangBase(event, botUserId));
      }
    }

    if (event.type === "assistant_thread_started") {
      waitUntil(assistantThreadMessageLangbase(event));
    }

    if (
      event.type === "message" &&
      !event.subtype &&
      event.channel_type === "im" &&
      !event.bot_id &&
      !event.bot_profile &&
      event.bot_id !== botUserId
    ) {
      // Check if direct message contains a command
      const command = parseCommand(event.text ?? "");
      if (command) {
        waitUntil(handleCommand(event, command, botUserId));
      } else {
        waitUntil(handleNewAssistantMessageLangbase(event, botUserId));
      }
    }

    return new Response("Success!", { status: 200 });
  } catch (error) {
    console.error("Error generating response", error);
    return new Response("Error generating response", { status: 500 });
  }
}