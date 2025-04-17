import { langbase } from "./utils";
import { Message } from "langbase";


export const generateResponseLangBase = async (
  messages: Message[],
  updateStatus?: (status: string) => void,
) => {
	
	const response = await langbase.pipes.run({
		name: 'support-agent',
		stream: false,
		messages
	})

	const completion = response.completion

	return completion

};
