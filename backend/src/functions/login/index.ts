import { newInternalServerErrorResponse, newInvalidRequestResponse, newSuccessResponse, newUnauthorizedResponse } from '@/apigateway/response';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AnyZodObject, z, ZodError } from 'zod'
import { errorMap } from '@/error';
import { LoginRequest } from './model';
import { getUserPasswordAndIdFromEmail } from '@/storage/user';
import {  PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { validateHash } from '@/crypt/validateHash';
import { createNewSession, deleteUserSession, getSessionFromUserId } from '@/storage/session';
import { Session } from '@prisma/client';
import * as cookie from 'cookie';

const validateRequest = async <RequestType extends AnyZodObject>(body: string, parser: RequestType): Promise<[z.infer<RequestType> | null, APIGatewayProxyResult | null]> => {
    let loginRequest: z.infer<RequestType>;
    
    try {
        const jsonBody = JSON.parse(body)
        loginRequest = parser.parse(jsonBody, { errorMap });
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
    const [ loginRequest, errResponse ] = await validateRequest(_event.body || "", LoginRequest);
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
            if (err.code === "P2025") { // If email does not exist
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
    let session: Session | null;
    try {
        session = await getSessionFromUserId(user.id);
    } catch(err) {    
        if (!(err instanceof PrismaClientKnownRequestError)) {
            return newInternalServerErrorResponse();
        } 

        if (err.code !== "P2025") { // If it does not find the session
            return newInternalServerErrorResponse();
        }

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
        const newCookie = cookie.serialize("Authorization", sessionId, {
            maxAge: 5 * 24 * 60 * 60, //days * hours * minutes * seconds, 5 days
            secure: true,
            httpOnly: true
        })
        return newSuccessResponse({ message: "Login succesful" }, { 'Set-Cookie': newCookie })
    } catch (err) {
        return newInternalServerErrorResponse();
    }
};