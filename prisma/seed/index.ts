import {logger} from "../../src/lib/logger";
import {createAdminAccount} from "./AdminAccount";

export async function index() {
    try {
        logger.info("Initialization application started");
        await createAdminAccount();
        logger.info("Initialization application finished");
    } catch (err) {
        if (err instanceof Error) {
            logger.error(err.message);
        }
        console.error(err);
        process.exit(1);
    }
}

index();
