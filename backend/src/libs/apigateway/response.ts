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

export const newForbiddenResponse = (message: string): APIGatewayProxyResult => {
    return {
        statusCode: 403,
        body: JSON.stringify({
           message: `Forbidden: ${message}`
        })
    }
}

export const newSuccessResponse = (body: any): APIGatewayProxyResult => {
    return {
        statusCode: 200,
        body: JSON.stringify(body)
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