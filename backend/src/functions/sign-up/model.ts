import { z } from 'zod'

export const SignUpRequest = z.object({
    email: z.string(),
    password: z.string()
})

export type SignUpRequest = z.infer<typeof SignUpRequest>