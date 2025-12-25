import Groq from "groq-sdk";
import { AI_COMMAND_PROMPT } from "./ai.prompt";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export const parseAICommand = async (input: string) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: AI_COMMAND_PROMPT,
      },
      {
        role: "user",
        content: input,
      },
    ],
  });

  const raw = completion.choices[0].message.content;

  try {
    return JSON.parse(raw || "");
  } catch {
    return { error: "invalid_command" };
  }
};
