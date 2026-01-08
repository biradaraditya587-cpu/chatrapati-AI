
import { GoogleGenAI, Type } from "@google/genai";
import { ClassificationResult, ClassificationType } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeEmail = async (content: string, subject: string): Promise<ClassificationResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following email for spam, phishing, or legitimate characteristics. 
    Subject: ${subject}
    Content: ${content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            description: "Classification of the email: SPAM, HAM, PHISHING, or UNSURE",
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence score from 0 to 100",
          },
          explanation: {
            type: Type.STRING,
            description: "Brief summary of why this classification was chosen",
          },
          features: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Feature name like 'Sense of Urgency', 'Suspicious Links', etc." },
                score: { type: Type.NUMBER, description: "Intensity of this feature from 0 to 100" },
                description: { type: Type.STRING, description: "Detailed observation of this feature" }
              },
              required: ["name", "score", "description"]
            }
          },
          recommendation: {
            type: Type.STRING,
            description: "Advice for the user (e.g., 'Delete immediately', 'Safe to open')"
          }
        },
        required: ["type", "confidence", "explanation", "features", "recommendation"]
      }
    }
  });

  const rawResult = JSON.parse(response.text);
  
  return {
    ...rawResult,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    content,
    subject
  };
};
