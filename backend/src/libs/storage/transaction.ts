import { Transaction, TransactionStatus } from "@prisma/client";
import prisma from "./prisma";


export const createTransaction = async (req: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> => {
    const transaction = await prisma.transaction.create({
        data: req
    })

    return transaction
}   

export const updatePaymentStatus = async (transactionId: string, status: TransactionStatus): Promise<void> => {
    await prisma.transaction.update({
        where: {
            id: transactionId
        },
        data: {
            status: status
        }
    })
}