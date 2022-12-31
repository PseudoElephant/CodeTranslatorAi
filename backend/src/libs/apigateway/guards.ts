import { APIGatewayProxyResult } from "aws-lambda"

export const isApiGatewayProxyResult = (result: unknown): result is APIGatewayProxyResult => {
    if (result === null || result === undefined) return false;
    if (typeof result !== 'object') return false;
    const r = result as APIGatewayProxyResult;
    return (
        'statusCode' in r &&
        typeof r.statusCode === 'number' 
    );
};
