import prisma from "./prisma"

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