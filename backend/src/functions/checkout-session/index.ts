// src/functions/cars/index.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
       const r = await prisma.package.create({
                data: {
                    name: 'test',
                    priceUsd: 100,
                    numTranslations: 100,
                }   
        })

        const response = {
            statusCode: 200,
            body: JSON.stringify(r),
        };
        return response;
    } catch (err) {
        return {
            statusCode: 500,
            body: 'Internal Server Error',
        };
    }
};