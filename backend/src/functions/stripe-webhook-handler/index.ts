import * as dotenv from 'dotenv'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Stripe from 'stripe'

// Load environment variables from .env file
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: '2022-11-15',
    typescript: true,
})


const handleCheckoutSessionCompleted = async (jsonData: any) => {
    console.log('Checkout session completed')
}

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const webhookSecret = process.env.STRIPE_WEBHOOK_KEY || "";
        const sig = _event.headers["Stripe-Signature"] || "";
        console.log(`Stripe-Signature: ${sig}`);
        console.log(`Webhook Secret: ${webhookSecret}`);
        console.log(process.env)

        const body = _event.body || ""
        const stripeEvent = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        const eventType = stripeEvent.type ? stripeEvent.type : '';
        const jsonData = JSON.parse(body);

        console.log(`Event Type: ${eventType}`);
        console.log(jsonData)

        switch (eventType) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(jsonData)
                break;
            case 'payment_intent.succeeded':
                console.log('Payment intent succeeded')
                break;
            case 'payment_intent.payment_failed':
                console.log('Payment intent failed')
                break;
            default:
                console.log('Unhandled event type')
                break;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(stripeEvent),
        };
        return response;
    } catch (err) {
        return {
            statusCode: 500,
            body: 'Internal Server Error',
        };
    }
};