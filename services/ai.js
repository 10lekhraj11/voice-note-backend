import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";

import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export async function transcribeWithGemini(fileName) {
  const filePath = path.join(process.cwd(), "uploads", fileName);

  // Read audio file and convert to Base64
  const audioBytes = fs.readFileSync(filePath).toString("base64");

  // Load Gemini model with audio support
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Ask Gemini to transcribe
  const result = await model.generateContent([
    {
      text: "Please transcribe the following audio exactly into text. If unclear, still output what you hear:",
    },
    {
      inlineData: {
        mimeType: "audio/webm", // or "audio/webm" if you didn’t convert
        data: audioBytes,
      },
    },
  ]);

  return result.response.text();
}

export async function transcribeAudio(filePath) {
  try {
    const data = await transcribeWithGemini(filePath);
    const transcript = data || "[No transcript returned]";
    console.log("Transcript:", transcript);
    return transcript;
  } catch (err) {
    console.error("Whisper Transcription Error:", err.message || err);
    throw err;
  }
  return "[Transcript feature needs Google Speech-to-Text integration]";
}

export async function summarizeText(text) {
  try {
    console.log("Inside Gemini Summarization");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Summarize this note in 2-3 sentences:\n\n${text}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini Summarization Error:", err);
    throw err;
  }
}
