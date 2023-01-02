import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Configuration, OpenAIApi } from "openai";
import { ZodError } from 'zod'
import { decrementUserTranslations, getUserTranslations } from '@libs/storage/user';
import { newForbiddenResponse, newInternalServerErrorResponse, newInvalidRequestResponse, newSuccessResponse } from '@libs/apigateway/response';
import { errorMap } from '@libs/error';
import { validateRequest } from '@libs/apigateway/validateRequest';
import { isApiGatewayProxyResult } from '@libs/apigateway/guards';

import { TranslatorRequest } from './models';

/// Constants ============================================================
const MAX_TOKENS = 300;
const MODEL = "code-davinci-002";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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
    code = code.trimStart();
    code = code.trimEnd();
    return code
};

const decrementTranslations = async (userId: string): Promise<void | APIGatewayProxyResult> => {
    try {
        await decrementUserTranslations(userId);
        return;
    } catch (err) {
        return newInternalServerErrorResponse();
    }
}

const handleTranslation = async (userId: string, translatorRequest: TranslatorRequest): Promise<APIGatewayProxyResult> => {
    try {
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

        const data = response.data.choices?.[0]?.text || "";

        const decrementErr = await decrementTranslations(userId);
        if (decrementErr) {
            return decrementErr;
        }

        return newSuccessResponse({
            code: parseCode(data),
        });
    } catch (err) {
        return newInternalServerErrorResponse();
    }
}

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Check if user has credits
    const userId = _event.requestContext.authorizer?.userId;
    if (!userId) {
        return newInvalidRequestResponse("No user id found");
    }

    try {
        if (!await hasTranslationsLeft(userId)) {
            return newForbiddenResponse("You have no credits left");
        }
    } catch (err) {
        return newInternalServerErrorResponse()
    }
        
    // Validate request
    const translatorRequest = await validateRequest(_event.body || "", TranslatorRequest);
    if (isApiGatewayProxyResult(translatorRequest)) {
        return translatorRequest
    }
    
    translatorRequest.code = parseCode(translatorRequest.code);

    // Process request
    return await handleTranslation(userId, translatorRequest);
    
};