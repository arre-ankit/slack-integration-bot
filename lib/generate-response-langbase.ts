import { langbase } from "./utils";
import { Message } from "langbase";


export const generateResponseLangBase = async (
  messages: Message[],
  updateStatus?: (status: string) => void,
) => {

    const response1 = await langbase.pipes.run({
		name: 'support-answer-agent',
		stream: false,
		messages
	});

  // Convert markdown to Slack mrkdwn format
  console.log(response1.completion)
  return response1.completion;
};