import { z } from "zod";

// CheckoutRequest is the request body for the checkout-session function
export const CheckoutRequest = z.object({
    itemId: z.number()
})

export type CheckoutRequest = z.infer<typeof CheckoutRequest>