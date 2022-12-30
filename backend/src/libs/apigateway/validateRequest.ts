import { AnyZodObject, z, ZodError } from "zod";
import { errorMap } from '@/error';
import { APIGatewayProxyResult } from "aws-lambda";
import { newInvalidRequestResponse, newInternalServerErrorResponse } from "./response";

export const validateRequest = async <RequestType extends AnyZodObject>(body: string, parser: RequestType): Promise<z.infer<RequestType> | APIGatewayProxyResult> => {
    let requestBody: z.infer<RequestType>;
    
    try {
        const jsonBody = JSON.parse(body)
        requestBody = parser.parse(jsonBody, { errorMap });
    } catch(err) {
        if (err instanceof ZodError) {
            const errMessage = err.issues?.[0].message || "Unknown error";
            return newInvalidRequestResponse(errMessage);
        }

        if (err instanceof SyntaxError) {
            return newInvalidRequestResponse("Invalid JSON");
        }

        return newInternalServerErrorResponse();
    }

    return requestBody;
}