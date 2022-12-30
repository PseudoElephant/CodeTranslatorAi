import { newInternalServerErrorResponse, newInvalidRequestResponse, newSuccessResponse, newUnauthorizedResponse } from '@/apigateway/response';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LoginRequest } from './model';
import { getUserPasswordAndIdFromEmail } from '@/storage/user';
import {  PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { validateHash } from '@/crypt/validateHash';
import { createNewSession, deleteUserSession, getSessionFromUserId } from '@/storage/session';
import { Session } from '@prisma/client';
import * as cookie from 'cookie';
import { validateRequest } from '@/apigateway/validateRequest';
import { isApiGatewayProxyResult } from '@/apigateway/guards';

const getUserIdAndHashedPassword = async (email: string): Promise<{ id: string, password: string } | APIGatewayProxyResult> => {
    try {
        return await getUserPasswordAndIdFromEmail(email);
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === "P2025") { // If email does not exist
                return newUnauthorizedResponse();
            }
        } 

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
            return newInternalServerErrorResponse();
        } 

        if (err.code !== "P2025") { // If it does not find the session
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
        return newInternalServerErrorResponse();
    }

    return newSession;
}

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const loginRequest = await validateRequest(_event.body || "", LoginRequest);
    if (isApiGatewayProxyResult(loginRequest)) {
        return loginRequest;
    }

    let user = await getUserIdAndHashedPassword(loginRequest.email);
    if (isApiGatewayProxyResult(user)) {
        return user;
    }

    let valid = await validatePassword(loginRequest.password, user.password);
    if (isApiGatewayProxyResult(valid)) {
        return valid;
    }

    let session = await createSession(user.id);
    if (isApiGatewayProxyResult(session)) {
        return session;
    }
         
    // Return the sessionId as a cookie
    try {
        const newCookie = cookie.serialize("Authorization", session.sessionId, {
            maxAge: 5 * 24 * 60 * 60, //days * hours * minutes * seconds, 5 days
            secure: true,
            httpOnly: true
        })

        return newSuccessResponse({ message: "Login succesful" }, { 'Set-Cookie': newCookie })
    } catch (err) {
        return newInternalServerErrorResponse();
    }
};