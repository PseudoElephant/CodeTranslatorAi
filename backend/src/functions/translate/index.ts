// src/functions/cars/index.ts
import * as dotenv from 'dotenv'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Configuration, OpenAIApi } from "openai";
import { z, ZodError } from 'zod'
import { getUserTranslations } from '../../libs/storage/user';

dotenv.config()

// Global Vars ============================================================
const MAX_TOKENS = 300;
const MODEL = "code-davinci-002";
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


// Type declarations ============================================================
const TranslatorRequest = z.object({
    code: z.string(),
    languageFrom: z.string(),
    languageTo: z.string(),
})

type TranslatorRequest = z.infer<typeof TranslatorRequest>;


// Functions ============================================================
const getPrompt = (translatorRequest: TranslatorRequest): string =>{
    const languageFrom = translatorRequest.languageFrom;
    const languageTo = translatorRequest.languageTo;
    const code = translatorRequest.code;
    
    return `##### Translate this code from ${languageFrom} into ${languageTo}
    ### ${languageFrom}
    ${code}
    ### ${languageTo}`
}

const hasTranslationsLeft = async (userId: string): Promise<boolean> => {
    const tranlationsLeft = await getUserTranslations(userId);
    return tranlationsLeft >= 1
}

const parseCode = (code: string): string => {
    //Remove comments?

    //Remove additional \n at the end of string
    
    return code
};

const translate = async (translatorRequest: TranslatorRequest): Promise<string> => {
    const response = await openai.createCompletion({
        model: MODEL,
        prompt: getPrompt(translatorRequest),
        temperature: 0,
        max_tokens: MAX_TOKENS,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["###"],
    });
    
    //TODO: Fix crappy return
    return response.data.choices[0].text || "";
}

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Check if user has credits
    try {
        const userId = "1"; //TODO: Get proper user id
        if (!hasTranslationsLeft(userId)) {
            return {
                statusCode: 403,
                body: "User does not have translations left",
            }
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: "Internal server error"
        }
    }
    
    let translatorRequest: TranslatorRequest;
    
    // Parse body
    try {
        const jsonBody = JSON.parse(_event.body || "")
        translatorRequest = TranslatorRequest.parse(jsonBody);
    } catch(err) {
        console.log(err);
        if (err instanceof ZodError) {
            //TODO: Add better error handling
            const errMessage = err.errors[0].path[0] + " " + err.errors[0].message;
            return {
                statusCode: 400,
                body: errMessage,
            }
        }

        return {
            statusCode: 500,
            body: 'Internal server error'
        }
    }
    
    translatorRequest.code = parseCode(translatorRequest.code);
    
    // Translate Request/Response
    try {
        let translatedCode = await translate(translatorRequest);

        const response = {
            statusCode: 200,
            body: JSON.stringify({text: translatedCode}),
        };

        return response;
    } catch (err) {
        return {
            statusCode: 500,
            body: 'Internal Server Error',
        };
    }
};