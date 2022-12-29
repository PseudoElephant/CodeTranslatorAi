import { newConflictErrorResponse, newInternalServerErrorResponse, newInvalidRequestResponse, newSuccessResponse } from '@/apigateway/response';
import { encrypt } from '@/crypt/validateHash';
import { createNewUser } from '@/storage/user';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ZodError } from 'zod';
import { errorMap } from '@/error';
import { SignUpRequest } from './model';

const validateRequest = async (body: string): Promise<[SignUpRequest | null, APIGatewayProxyResult | null]> => {
    let signUpRequest: SignUpRequest;

    try {
        const jsonBody = JSON.parse(body)
        signUpRequest = SignUpRequest.parse(jsonBody, { errorMap });
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

    return [signUpRequest, null];
}

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const [ SignUpRequest, errResponse ] = await validateRequest(_event.body || "");
    if (errResponse) {
        return errResponse;
    }

    if (!SignUpRequest) {
        return newInternalServerErrorResponse();
    }

    //TODO: confirm email?

    let hashedPassword: string;
    try {
        hashedPassword = await encrypt(SignUpRequest.password);
    } catch (err) {
        return newInternalServerErrorResponse();
    }

    // Create new user
    try {
        await createNewUser(SignUpRequest.email, hashedPassword);
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === "P2002") { // if email is already on server
                return newConflictErrorResponse("Email is already in use");
            }
        }

        return newInternalServerErrorResponse();
    }
    
    //TODO: Finish proper return statement
    try {
        return newSuccessResponse(_event.body);
    } catch (err) {
        return newInternalServerErrorResponse();
    }
};