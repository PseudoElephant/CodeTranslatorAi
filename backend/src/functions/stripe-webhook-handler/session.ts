import { TransactionStatus } from "@prisma/client";
import Stripe from "stripe";


export const stripePaymentStatusToTransactionStatus = (paymentStatus: Stripe.Checkout.Session.PaymentStatus): TransactionStatus => {
    switch (paymentStatus) {
        case "no_payment_required":
        case "paid":
            return "SUCCESS"
        case "unpaid":
            return "PENDING"
    }
}
