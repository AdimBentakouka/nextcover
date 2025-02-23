/**
 * Adds a specified number of days to a given date.
 *
 * @param {Date} date - The initial date to which days will be added.
 * @param {number} days - The number of days to add to the given date.
 * @returns {Date} A new Date object representing the resulting date after adding the specified number of days.
 */
export const addDays = (date: Date, days: number): Date =>
    new Date(date.getTime() + days * 24 * 60 * 60 * 1_000);
