import { newInternalServerErrorResponse, newSuccessResponse, newUnauthorizedResponse } from '@libs/apigateway/response';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LoginRequest } from './models';
import { getUserPasswordAndIdFromEmail } from '@libs/storage/user';
import {  PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { validateHash } from '@libs/crypt/validateHash';
import { createNewSession, deleteUserSession, getSessionFromUserId } from '@libs/storage/session';
import { Session } from '@prisma/client';
import { validateRequest } from '@libs/apigateway/validateRequest';
import { isApiGatewayProxyResult } from '@libs/apigateway/guards';

const getUserIdAndHashedPassword = async (email: string): Promise<{ id: string, password: string } | APIGatewayProxyResult> => {
    try {
        return await getUserPasswordAndIdFromEmail(email);
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === "P2025") { // If email does not exist
                return newUnauthorizedResponse();
            }
        } 

        console.log(err);
        return newInternalServerErrorResponse();
    }
}

const validatePassword = async (password: string, hashedPassword: string): Promise<null | APIGatewayProxyResult> => {
    try {
        const passwordIsValid = await validateHash(password, hashedPassword);
        if (!passwordIsValid) {
            return newUnauthorizedResponse();
        }
    } catch (err) {
        console.log(err);
        return newInternalServerErrorResponse();
    }

    return null
}

const createSession = async (userId: string): Promise<Session | APIGatewayProxyResult> => {
    let session: Session | null;
    try {
        session = await getSessionFromUserId(userId);
    } catch(err) {    
        if (!(err instanceof PrismaClientKnownRequestError)) {
            console.log(err);
            return newInternalServerErrorResponse();
        } 

        if (err.code !== "P2025") { // If it does not find the session
            console.log(err);
            return newInternalServerErrorResponse();
        }

        session = null
    }

    let newSession: Session;
    try {
        if (session !== null) {
            await deleteUserSession(userId);
        }
        
        newSession = await createNewSession(userId);
    } catch (err) {
        console.log(err);
        return newInternalServerErrorResponse();
    }

    return newSession;
}

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const validateRequestOutput = await validateRequest(_event.body || "", LoginRequest);
    if (isApiGatewayProxyResult(validateRequestOutput)) {
        return validateRequestOutput;
    }

    let getUserOutput = await getUserIdAndHashedPassword(validateRequestOutput.email);
    if (isApiGatewayProxyResult(getUserOutput)) {
        return getUserOutput;
    }

    let validationOutput = await validatePassword(validateRequestOutput.password, getUserOutput.password);
    if (isApiGatewayProxyResult(validationOutput)) {
        return validationOutput;
    }

    let sessionOutput = await createSession(getUserOutput.id);
    if (isApiGatewayProxyResult(sessionOutput)) {
        return sessionOutput;
    }
         
    try {
        return newSuccessResponse({ accessToken: sessionOutput.sessionId })
    } catch (err) {
        console.log(err);
        return newInternalServerErrorResponse();
    }
};