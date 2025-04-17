import { langbase } from "./utils";
import { Message } from "langbase";


export const generateResponseLangBase = async (
  messages: Message[],
  updateStatus?: (status: string) => void,
) => {
	await langbase.pipes.create({
		name: 'command-agent-slack',
		description: 'A pipe that can execute commands',
		upsert: true,
		messages: [
			{
				role: 'system',
				content: `You are a helpful AI assistant designed to assist users in building and running agents. 
					Respond with one word very short
					Your primary tasks include:

						1. **Understanding User Intent**: Accurately interpret user requests related to building or running agents.
						2. **Providing Clear Instructions**: Offer step-by-step guidance on how to build or run an agent, including any prerequisites or necessary configurations.
						3. **Handling Missing Information**: If a user request lacks details, politely ask for the missing information to provide accurate assistance.
						4. **Offering Examples**: Provide examples to illustrate how users can achieve their goals.

						### Examples:

						- **Example 1: Build an Agent that help users summarize thread**
						- **User Input**: "I want to build an agent named 'WeatherBot'."
						- **Assistant Response**: "/build"

						- **Example 2: Running an Agent**
						- **User Input**: "How do I run the 'StockAnalyzer' agent?"
						- **Assistant Response**: "/run stock-analyser"

						Remember, your goal is to be as helpful and informative as possible, ensuring users can successfully build and run their agents with your guidance.`,
			}
		]

	});
    const commandResponse = await langbase.pipes.run({
		name: 'command-agent-slack',
		stream: false,
		messages
	});


	// Convert markdown to Slack mrkdwn format
	console.log(commandResponse.completion)
	if(commandResponse.completion.includes('build')){
		/*
			TODO: Send req to build agent
			via https://preview.langbase.com/?input=make an agent that can summarize thread&integration=slack
			we will send response like this:
			Here is the link to agent that is building: https://preview.langbase.com/agent-name/id
		*/

		// const response = await fetch('https://preview.langbase.com/?input=make an agent that can summarize thread&integration=slack', {
		// 	method: 'POST',
		// 	body: JSON.stringify({
		// 		input: "Thread/Conversation",
		// 	})
		// })

		// console.log(response)

		const user_query = messages[messages.length - 1].content



		return 'Building... ' + JSON.stringify(messages)
	}

	if(commandResponse.completion.includes('run')){
		/*
			TODO: Send req to run agent
			first check in db does that agent exist
			if not, return "Agent does not exist"
			if yes, via  api.langbase.com/login/agentName
			body:
			{
				input: "Thread/Conversation",
			}
			we will send response like this:
			Here is the output :
			Output from agent:
			```
			Output from agent
			```
		*/

		const user_query = messages[messages.length - 1].content
		
		const api = `https://staging-api.langbase.com/arre-ankit/create-an-cb07c88f1a`;
		const response = await fetch(api, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${process.env.STAGING_LANGBASE_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({"input":user_query})
		});

		return 'Running... ' + JSON.stringify(response)
	}

	return commandResponse.completion;

};
