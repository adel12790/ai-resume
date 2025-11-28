import { evaluate } from "@/lib/evaluator";

export async function POST(req: Request) {
  const body = await req.json();
  const result = await evaluate(body.reply, body.message, body.history);
  return Response.json(result);
}
