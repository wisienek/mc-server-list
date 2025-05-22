export const CurrentPathHeader = Symbol.for('x-current-path');

export const NextLocaleCookieKey = Symbol.for('NEXT_LOCALE');

export const BroadcastingChannels = {
    logged_in: 'logged_in',
    logged_out: 'logged_out',
} as const;
