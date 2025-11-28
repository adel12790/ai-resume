import { ChatOpenAI } from "@langchain/openai";

export const evaluatorModel = new ChatOpenAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  configuration: {
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
  }
});

export async function evaluate(reply: string, message: string, history: any[]) {
  const prompt = `
Return JSON: { "is_acceptable": boolean, "feedback": string }

User: ${message}
Assistant: ${reply}
History: ${JSON.stringify(history)}
`;

  const result = await evaluatorModel.invoke(prompt);
  try {
      // Clean up markdown code blocks if present
      const content = result.content.toString().replace(/```json\n?|\n?```/g, "");
      return JSON.parse(content);
  } catch (e) {
      console.error("Failed to parse evaluation result:", result.content);
      return { is_acceptable: true, feedback: "" }; // Fallback
  }
}
