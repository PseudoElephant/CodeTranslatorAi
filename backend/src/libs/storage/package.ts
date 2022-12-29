import { Package } from "@prisma/client";
import prisma from "./prisma";

export const getPackageFromId = async (packageId: number): Promise<Package> => {
    const pck = await prisma.package.findUniqueOrThrow({
        where: {
            id: packageId
        }
    })

    return pck
}