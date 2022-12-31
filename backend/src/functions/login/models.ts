import { z } from 'zod'

export const LoginRequest = z.object({
    email: z.string(),
    password: z.string()
})

export type LoginRequest = z.infer<typeof LoginRequest>
