import { User } from "@prisma/client";
import { string } from "zod";
import prisma from "./prisma"

export const getUserTranslations = async (userId: string): Promise<number> => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }, 
        select: {
            translationsLeft: true
        }
    });

    return user.translationsLeft;
}

export const decrementUserTranslations = async (userId: string): Promise<void> => {
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            translationsLeft: {
                decrement: 1
            }
        }
    });
}

export const getUserPasswordAndIdFromEmail = async (email: string): Promise<{id: string, password: string}> => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: email
        }, 
        select: {
            password: true,
            id: true
        }
    });

    return user;
}