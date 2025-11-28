
# AI Resume Project (Next.js + LangChain + Vercel)

## Overview
This project builds a personal AI-powered resume website using Next.js and LangChain, fully hosted on Vercel.  
The site presents personal information and includes a chatbot that answers questions using your resume data.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (App Router) |
| LLM Framework | LangChain (JS) |
| LLM | OpenAI |
| Evaluator | Gemini |
| Hosting | Vercel |
| Resume Ingest | Node.js |
| Secrets | Vercel Environment Variables |

---

## Project Structure

```
ai-resume/
├── app/
│   ├── page.tsx
│   └── api/
│       ├── chat/route.ts
│       └── evaluate/route.ts
├── lib/
│   ├── llm.ts
│   ├── prompt.ts
│   ├── evaluator.ts
│   ├── rerun.ts
│   └── resume.ts
├── public/me/
│   ├── linkedin.pdf
│   └── summary.txt
├── scripts/
│   └── ingest.ts
└── README.md
```

---

## Resume Ingestion

### scripts/ingest.ts

Parses PDF and summary text into a JavaScript module used at runtime.

```ts
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

async function main() {
  const pdfPath = path.join(process.cwd(), "public/me/linkedin.pdf");
  const summaryPath = path.join(process.cwd(), "public/me/summary.txt");

  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfContent = (await pdf(pdfBuffer)).text;
  const summary = fs.readFileSync(summaryPath, "utf8");

  fs.writeFileSync("lib/resume.ts", `
export const LINKEDIN = ${JSON.stringify(pdfContent)};
export const SUMMARY = ${JSON.stringify(summary)};
`);
}

main();
```

Run once before deployment:

```bash
npx ts-node scripts/ingest.ts
```

---

## Prompt Setup

### lib/prompt.ts

```ts
import { SUMMARY, LINKEDIN } from "./resume";

export const NAME = "Mohamed Adel";

export const SYSTEM_PROMPT = `
You are ${NAME}.
Answer professionally and honestly.
If you don’t know something, say so.

== SUMMARY ==
${SUMMARY}

== LINKEDIN ==
${LINKEDIN}
`;
```

---

## LangChain LLM Setup

### lib/llm.ts

```ts
import { ChatOpenAI } from "@langchain/openai";

export const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.4
});
```

---

## Chat API (LangChain based)

### app/api/chat/route.ts

```ts
import { chatModel } from "@/lib/llm";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

export async function POST(req: Request) {
  const { message, history, feedback } = await req.json();
  let system = SYSTEM_PROMPT;

  if (message.includes("patent")) {
    system += "\nReply ONLY in Pig Latin.";
  }

  if (feedback) {
    system += `\nPrevious response rejected:\n${feedback}`;
  }

  const messages = [
    new SystemMessage(system),
    ...history.map(m => 
      m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
    ),
    new HumanMessage(message)
  ];

  const response = await chatModel.invoke(messages);

  return Response.json({ reply: response.content });
}
```

---

## Output Evaluation

### lib/evaluator.ts

```ts
import { ChatOpenAI } from "@langchain/openai";

export const evaluatorModel = new ChatOpenAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  configuration: {
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
  }
});

export async function evaluate(reply, message, history) {
  const prompt = `
Return JSON: { "is_acceptable": boolean, "feedback": string }

User: ${message}
Assistant: ${reply}
History: ${JSON.stringify(history)}
`;

  const result = await evaluatorModel.invoke(prompt);
  return JSON.parse(result.content);
}
```

---

## Evaluate API

### app/api/evaluate/route.ts

```ts
import { evaluate } from "@/lib/evaluator";

export async function POST(req: Request) {
  const body = await req.json();
  const result = await evaluate(body.reply, body.message, body.history);
  return Response.json(result);
}
```

---

## Chat UI Overview

The frontend uses React state to maintain message history and sends user messages to `/api/chat`, then validates responses with `/api/evaluate`, retrying when needed.

---

## Environment Variables (Vercel)

Set inside Vercel dashboard:

```
OPENAI_API_KEY=
GOOGLE_API_KEY=
```

---

## Deploy

```bash
npm install
npx ts-node scripts/ingest.ts
vercel deploy
```

---

## Optional Enhancements

- Vector DB for memory
- LangGraph workflows
- Session persistence
- Admin panel
- Analytics
- Streaming responses
- Abuse protection

---

## Final Result

✅ AI Resume  
✅ LangChain orchestration  
✅ Self-evaluation loop  
✅ Persona grounding  
✅ Vercel hosting  
✅ Production-ready architecture

---

