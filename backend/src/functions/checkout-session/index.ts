// src/functions/cars/index.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Package, PrismaClient } from '@prisma/client'
import { getPackageFromId } from '@/storage/package';
import { CheckoutRequest } from './models';
import { newInternalServerErrorResponse, newInvalidRequestResponse, newNotFoundResponse, newRedirectResponse } from '@/apigateway/response';
import { errorMap } from '@/error';
import { ZodError } from 'zod';
import { isApiGatewayProxyResult } from '@/apigateway/guards';
import Stripe from 'stripe';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: '2022-11-15',
    typescript: true,
})

const DOMAIN = 'https://localhost:3000';

const parseRequest = (body: string | null): (CheckoutRequest | APIGatewayProxyResult) => {
    try {
        if (!body) {
            return newInvalidRequestResponse("Missing json body")
        }
        
        const jsonBody = JSON.parse(body)
        const checkoutRequest = CheckoutRequest.parse(jsonBody, { errorMap })
    
        return checkoutRequest

    } catch (err) {
        if (err instanceof SyntaxError) {
            return newInvalidRequestResponse("Invalid JSON")
        }

        if (err instanceof ZodError) {
            const errMessage = err.issues?.[0].message || "Unknown error";
            return newInvalidRequestResponse(errMessage);
        }

        return newInternalServerErrorResponse()
    }
}

const getPackageSelectedPackage = async (req: CheckoutRequest): Promise<Package | APIGatewayProxyResult> => {
    try {
        return await getPackageFromId(req.itemId)
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === "P2025") {
                return newNotFoundResponse(`'package' with id ${req.itemId}`)
            }
        }

        return newInternalServerErrorResponse()
    }
}

const processRequest = async (userId: string,  pck: Package): Promise<APIGatewayProxyResult> => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: pck.stripeID,
            quantity: 1,
          },
        ],
        mode: 'payment',
        client_reference_id: userId,
        payment_intent_data: {
            setup_future_usage: "on_session"
        },
        locale: "auto",
        automatic_tax: { enabled: true },
        success_url: `${DOMAIN}/success`,
        cancel_url: `${DOMAIN}/cancel`,
    });

    if (!session.url) {
        return newInternalServerErrorResponse()
    }

    
    return newRedirectResponse(session.url)

}

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = _event.requestContext.authorizer?.userId

    const parseReponse = parseRequest(_event.body)
    if (isApiGatewayProxyResult(parseReponse)) {
        return parseReponse
    }
    
    const packageResponse = await getPackageSelectedPackage(parseReponse)
    if (isApiGatewayProxyResult(packageResponse)) {
        return packageResponse
    }

    return processRequest(userId, packageResponse)
};