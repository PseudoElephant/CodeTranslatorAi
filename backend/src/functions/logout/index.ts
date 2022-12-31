// src/functions/cars/index.ts
import { newInternalServerErrorResponse, newInvalidRequestResponse, newSuccessResponse } from '@/apigateway/response';
import { deleteUserSession } from '@/storage/session';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = _event.requestContext.authorizer?.userId;
    if (!userId) {
        return newInvalidRequestResponse("No user id found");
    }
    
    try {
        await deleteUserSession(userId);
    } catch (err) {
        return newInternalServerErrorResponse();
    }

    try {
        return newSuccessResponse({ message: "Logout succesful" })
    } catch (err) {
        return newInternalServerErrorResponse();
    }
};