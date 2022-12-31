import { Package } from "@prisma/client";
import prisma from "./prisma";

export const getPackageFromId = async (packageId: number): Promise<Package> => {
    const packageItem = await prisma.package.findUniqueOrThrow({
        where: {
            id: packageId
        }
    })

    return packageItem
}

export const getPackageCreditsFromStripeId = async (stripeId: string): Promise<number> => {
    const pck = await prisma.package.findUniqueOrThrow({
        where: {
            stripeID: stripeId
        },
        select: {
            numTranslations: true
        }
    })

    return pck.numTranslations
}