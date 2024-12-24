import {db} from "../../src/lib/database";
import {logger} from "../../src/lib/logger";

export const createAdminAccount = async () => {
    const email = process.env.EMAIL_ADMIN ?? "nextcover@account.com";
    const password = process.env.PASSWORD_ADMIN ?? "Password123!";

    if (!(await checkAdminAccount(email))) {
        logger.info("Default user not found, creating new user ...");

        await db.user.create({
            data: {
                name: "Admin User",
                email: email,
                password: password,
                authorized_at: new Date(),
                isOwner: true,
            },
        });

        return logger.info(`Default user created (${email})`);
    }

    logger.info("Default user found");
};

export const checkAdminAccount = async (email: string) => {
    logger.info("Searching for the default user in the database...");

    const user = await db.user.findUnique({
        where: {
            email: email,
        },
    });

    return !!user;
};
