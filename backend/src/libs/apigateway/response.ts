import { APIGatewayProxyResult } from "aws-lambda"

export const newInvalidRequestResponse = (message: string): APIGatewayProxyResult => {
    return {
        statusCode: 400,
        body: JSON.stringify({
           message: `Invalid Request: ${message}`
        })
    }
}

export const newInternalServerErrorResponse = (message?: string): APIGatewayProxyResult => {
    return {
        statusCode: 500,
        body: JSON.stringify({
           message: message ? `Internal Server Error: ${message}` : "Internal Server Error"
        })
    }
}

export const newConflictErrorResponse = (message?: string): APIGatewayProxyResult => {
    return {
        statusCode: 409,
        body: JSON.stringify({
           message: message ? `Conflict Error: ${message}` : "Conflict Error"
        })
    }
}

export const newForbiddenResponse = (message: string): APIGatewayProxyResult => {
    return {
        statusCode: 403,
        body: JSON.stringify({
           message: `Forbidden: ${message}`
        })
    }
}

export const newSuccessResponse = (body: any, headers?: APIGatewayProxyResult["headers"]): APIGatewayProxyResult => {
    return {
        statusCode: 200,
        body: JSON.stringify(body),
        headers: headers
    }
}

export const newRedirectResponse = (location: string):  APIGatewayProxyResult => {
    return {
        statusCode: 303,
        headers: {
            Location: location,
        },
        body: ""
    }
}

export const newNotFoundResponse = (message: string): APIGatewayProxyResult => {
    return {
        statusCode: 404,
        body: JSON.stringify({
            message: message ? `Not Found: ${message}` : `Not Found`
        })
    }
}

export const newStatusResponse = (code: number): APIGatewayProxyResult => {
    return {
        statusCode: code,
        body: ""
    }
}

export const newUnauthorizedResponse = (): APIGatewayProxyResult => {
    return {
        statusCode: 401,
        body: JSON.stringify({
            message: "Unauthorized"
        })
    }
}