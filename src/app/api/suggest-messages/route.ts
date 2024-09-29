import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';


export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();
    const prompt = "Write friendly questions for question and answer applications. These questions would be displayed in suggestion, limit 10 questions, separate questions with || while responding.";

    try {
        const result = await streamText({
            model: openai('gpt-3.5-turbo'), 
            messages: convertToCoreMessages(messages),
            prompt
        });

        return result.toDataStreamResponse();
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;
            return NextResponse.json({
                name, status, headers, message
            }, {
                status
            });
        } else {
            console.error("An unexpected error occurred:", error);
            throw error;
        }
    }
}
