/**
 * Attend un certain nombre de millisecondes.
 *
 * @param {number} ms - Le temps à attendre en millisecondes.
 * @return {Promise<void>} Une promesse résolue après la période d'attente.
 */
export const wait = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));
