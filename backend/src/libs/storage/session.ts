import { Session } from "@prisma/client";
import prisma from "./prisma"

const createExpirationDate = (expirationTimeSeconds: number): Date => {
    let exprirationDate = new Date();
    exprirationDate.setSeconds(exprirationDate.getSeconds() + expirationTimeSeconds);
    return exprirationDate;
}

export const getUserIdFromSession = async (sessionId: string): Promise<string> => {
    const session = await prisma.session.findUniqueOrThrow({
        where: {
            sessionId: sessionId,
        },
        select: {
            userId: true
        }
    });

    return session.userId;
}

export const createNewSession = async (userId: string): Promise<Session> => {
    let exprirationDate = createExpirationDate(parseInt(process.env.SESSION_LIFE_TIME_SECONDS || "0"));

    let session = await prisma.session.create({
        data: {
            userId: userId,
            expires: exprirationDate,
        }
    })
    
    return session
}

export const updateUserSession = async (userId: string): Promise<string> => {
    let exprirationDate = createExpirationDate(parseInt(process.env.SESSION_LIFE_TIME_SECONDS || "0"));

    let session = await prisma.session.update({
        where: {
            userId: userId
        },
        data: {
            expires: exprirationDate
        }
    });

    return session.sessionId
}

export const deleteUserSession = async (userId: string): Promise<void> => {
    await prisma.session.delete({
        where: {
            userId: userId
        }
    })
}

export const getSessionFromUserId = async (userId: string): Promise<Session> => {
    const session = await prisma.session.findUniqueOrThrow({
        where: {
            userId: userId
        }
    })

    return session
}