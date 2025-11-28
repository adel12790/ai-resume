import { chatModel } from "@/lib/llm";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

export async function POST(req: Request) {
  const { message, history, feedback } = await req.json();
  let system = SYSTEM_PROMPT;

  if (feedback) {
    system += `\nPrevious response rejected:\n${feedback}`;
  }

  const messages = [
    new SystemMessage(system),
    ...history.map((m: any) => 
      m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
    ),
    new HumanMessage(message)
  ];

  // Create a streaming response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const streamResponse = await chatModel.stream(messages);
        
        for await (const chunk of streamResponse) {
          const content = chunk.content;
          if (content) {
            // Convert content to string if it's an array
            const text = typeof content === 'string' ? content : JSON.stringify(content);
            controller.enqueue(encoder.encode(text));
          }
        }
        
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
