import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });


export async function POST(request: Request) {

    const prompt = "create a list of three open-ended and engaging questions formatted as a single string. Each question should be seperated by '||' . These questions are for an anonymous social plateform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal and sensitive topics, focusing instead of universal themes that encourage friendly interaction. For example, your output should be structured like this : What is your favorite childhood memory? || If you could travel anywhere in the world, where would you go and why? || What is a skill you've always wanted to learn but haven't had the chance to yet?. Ensure the questions are intriguing, foster curiosity and contribute to a positive and welcoming environment."

    try {
        const response = await ai.models.generateContentStream({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        let questions = ""
        for await (const chunk of response) {
            questions += chunk.text
        }
        return Response.json(
            {
                success: true,
                message: "Messages generated successfully",
                messages: questions
        });

    } catch (error) {
        console.error("Error generating content:", error);
        return Response.json(
            {
                success: false,
                message:"Error generating content"
            });
    }

}
