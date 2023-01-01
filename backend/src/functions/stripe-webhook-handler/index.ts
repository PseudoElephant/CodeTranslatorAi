import { newInternalServerErrorResponse, newStatusResponse } from '@libs/apigateway/response';
import { sendEmail } from '@libs/email/client';
import { getPackageCreditsFromStripeId } from '@libs/storage/package';
import { createTransaction, updatePaymentStatus } from '@libs/storage/transaction';
import { incrementUserTranslations } from '@libs/storage/user';
import { Transaction, TransactionStatus } from '@prisma/client';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Stripe from 'stripe'
import { stripePaymentStatusToTransactionStatus } from './session';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: '2022-11-15',
    typescript: true,
})

const handleCreateTransaction = async (userId: string, session: Stripe.Checkout.Session): Promise<Transaction> => {
     const req: Omit<Transaction, "id" | "createdAt"> = {
        userId: userId,
        stripeTransactionId: session.id,
        tax: session.total_details?.amount_tax || 0,
        discount: session.total_details?.amount_discount || 0,
        total: session.amount_total || 0,
        currency: session.currency || "unknown",
        status: stripePaymentStatusToTransactionStatus(session.payment_status)
    }

    return await createTransaction(req)
}

/// TODO: handle error, and log to sentry or other error tracking service

const calculateCredits = async (session: Stripe.Checkout.Session): Promise<number> => {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

    if (!lineItems.data || lineItems.data.length === 0) return 0

    let totalCredits = 0;

    
    for (const item of lineItems.data) {
        const priceId = item.price?.id || ""

        const credits = await getPackageCreditsFromStripeId(priceId)
        totalCredits += credits * (item.quantity || 1)
    }

    return totalCredits
}

const applyCreditsToUser = async (userId: string, session: Stripe.Checkout.Session) => {
    // calculate credits
    const credits = await calculateCredits(session)

    // apply credits to user
    await incrementUserTranslations(userId, credits)
}

const handleCheckoutSessionCompleted = async (event: Stripe.Event) => {  
   const session = event.data.object as Stripe.Checkout.Session

   const userId = session.client_reference_id || ""
   
    // handle create transaction
    const transaction = await handleCreateTransaction(userId, session)

    // if paid fullfill request
    if (transaction.status === TransactionStatus.SUCCESS) {
        await applyCreditsToUser(userId, session)
    }
}

const handleAsyncPaymentSucceeded = async (event: Stripe.Event) => {
    const session = event.data.object as Stripe.Checkout.Session

    // update payment status on transaction
    await updatePaymentStatus(session.id, TransactionStatus.SUCCESS)

    // fullfill transaction
    await applyCreditsToUser(session.client_reference_id || "", session)
}

const handleAsyncPaymentFailed = async (event: Stripe.Event) => {
    const session = event.data.object as Stripe.Checkout.Session
    // update payment status on transaction
    await updatePaymentStatus(session.id, TransactionStatus.FAILED)

    // send email about failed payment
    await sendEmail(session.client_reference_id || "", "FAILED_PAYMENT")
}

const handleCheckoutExpired = async (event: Stripe.Event) => {
    const session = event.data.object as Stripe.Checkout.Session

    // update payment status on transaction
    await updatePaymentStatus(session.id, TransactionStatus.EXPIRED)
}

const parseWebhook = (_event: APIGatewayProxyEvent) : Stripe.Event => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_KEY || "";
    const sig = _event.headers["Stripe-Signature"] || "";
   
    const body = _event.body || ""
    return stripe.webhooks.constructEvent(body, sig, webhookSecret);
}

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const stripeEvent = parseWebhook(_event)
        const eventType = stripeEvent.type || ""

        switch (eventType) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(stripeEvent)
                break;
            case 'checkout.session.async_payment_succeeded':
                await handleAsyncPaymentSucceeded(stripeEvent)
                break;
            case 'checkout.session.async_payment_failed':
                await handleAsyncPaymentFailed(stripeEvent)
                break;
            case 'checkout.session.expired':
                await handleCheckoutExpired(stripeEvent)
            default:
                throw new Error(`Unhandled event type: ${eventType}`)
        }

        return newStatusResponse(200)
    } catch (err) {
        console.error(err)
        return newInternalServerErrorResponse()
    }
};