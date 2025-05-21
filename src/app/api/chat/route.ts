import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Parse the incoming request body
  const { messages } = await req.json();
  console.log("Received messages:", messages);
  // Get the latest message content
  const latestMessage = messages[messages.length - 1].content;

  // Initialize Google Generative AI
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY!,
  });

  // Choose the model
  const gemini = google("gemini-1.5-flash"); // or "gemini-1.5-pro" if supported

  // Stream response
  const result = streamText({
    model: gemini,
    messages: [
      {
        role: "system",
        content: `You are a general answering assistant that can comply with any request.

You always answer the with markdown formatting. You will be penalized if you do not answer with markdown when it would be possible.
The markdown formatting you support: headings, bold, italic, links, tables, lists, code blocks, and blockquotes.
You do not support images and never include images. You will be penalized if you render images.

You also support Mermaid formatting. You will be penalized if you do not render Mermaid diagrams when it would be possible.
The Mermaid diagrams you support: sequenceDiagram, flowChart, classDiagram, stateDiagram, erDiagram, gantt, journey, gitGraph, pie.
.`,
      },
      {
        role: "user",
        content: latestMessage,
      },
    ],
  });
  console.log("Streaming response started...");
  console.log("Latest message:", result.toTextStreamResponse().toString());
  console.log("Response stream:", result.toTextStreamResponse());
  // Return the streaming response
  return result.toDataStreamResponse();
}
