import { newInternalServerErrorResponse, newInvalidRequestResponse, newUnauthorizedResponse } from '@/apigateway/response';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ZodError } from 'zod'
import { errorMap } from '@/error';
import { LoginRequest } from './model';
import { getUserPasswordAndIdFromEmail } from '@/storage/user';
import {  PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { validateHash } from '@/crypt/validateHash';
import { createNewSession, deleteUserSession, getSessionFromUserId } from '@/storage/session';

const validateRequest = async (body: string): Promise<[LoginRequest | null, APIGatewayProxyResult | null]> => {
    let loginRequest: LoginRequest;

    try {
        const jsonBody = JSON.parse(body)
        loginRequest = LoginRequest.parse(jsonBody, { errorMap });
    } catch(err) {
        if (err instanceof ZodError) {
            const errMessage = err.issues?.[0].message || "Unknown error";
            return [null, newInvalidRequestResponse(errMessage)];
        }

        if (err instanceof SyntaxError) {
            return [null, newInvalidRequestResponse("Invalid JSON")];
        }

        return [null, newInternalServerErrorResponse()];
    }

    return [loginRequest, null];
}

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const [ loginRequest, errResponse ] = await validateRequest(_event.body || "");
    if (errResponse) {
        return errResponse;
    }

    if (!loginRequest) {
        return newInternalServerErrorResponse();
    }

    // Get User ID and Hashed Password
    let user: { id: string, password: string };
    try {
        user = await getUserPasswordAndIdFromEmail(loginRequest.email);
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === "P2025") {
                return newUnauthorizedResponse();
            }
        } 

        return newInternalServerErrorResponse();
    }

    //Validate password
    try {
        const passwordIsValid = await validateHash(loginRequest.password, user.password);
        if (!passwordIsValid) {
            return newUnauthorizedResponse();
        }
    } catch (err) {
        return newInternalServerErrorResponse();
    }

    // Create session for user
    let session: { id: number, expires: Date } | null;
    try {
        session = await getSessionFromUserId(user.id);
    } catch {
        session = null
    }

    let sessionId: string;
    try {
        if (session !== null) {
            await deleteUserSession(user.id);
        }
        
        sessionId = await createNewSession(user.id);
    } catch (err) {
        return newInternalServerErrorResponse();
    }
         
    // Return the session id
    try {
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Login successful'
                }),
            headers: {
                Authorizer: sessionId
            }
        };

        return response;
    } catch (err) {
        return newInternalServerErrorResponse();
    }
};