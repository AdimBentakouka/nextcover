/**
 * Extracts the initials from a given name string.
 *
 * If the name contains a space separating multiple words, it returns the first letter
 * of the first word and the first letter of the last word concatenated together.
 * If the name does not contain a space, it returns the first letter of the name.
 *
 * @param {string} name - The full name or single word string from which to extract initials.
 * @returns {string} The initials extracted from the provided name.
 */
export const getInitials = (name: string): string => {
    if (name?.includes(' ')) {
        const part = name.split(' ');
        return part[0][0] + part[part.length - 1][0];
    }

    return name[0] || '';
};