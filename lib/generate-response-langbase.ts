import { langbase } from "./utils";
import { Message } from "langbase";


export const generateResponseLangBase = async (
  messages: Message[],
  updateStatus?: (status: string) => void,
) => {

    const commandResponse = await langbase.pipes.run({
		name: 'command-agent',
		stream: false,
		messages
	});

	

	// Convert markdown to Slack mrkdwn format
	console.log(commandResponse.completion)
	if(commandResponse.completion.includes('build')){
		return 'Building...'
	}

	if(commandResponse.completion.includes('run')){
		return 'Running...'
	}

	return commandResponse.completion;

};
