/**
 * Shortens a given text to a specified maximum length.
 * If the text is longer than maxLength, it is trimmed and an ellipsis ("...") is appended.
 * The final returned string will have a length of at most maxLength.
 *
 * @param text - The input text to shorten.
 * @param maxLength - The maximum allowed length for the returned string.
 * @returns The shortened text.
 */
export default function shortenText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }

    if (maxLength <= 3) {
        return text.slice(0, maxLength);
    }

    return text.slice(0, maxLength - 3) + '...';
}
