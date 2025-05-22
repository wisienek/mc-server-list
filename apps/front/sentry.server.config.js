const Sentry = require('@sentry/nextjs');

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    sendDefaultPii: true,
});

const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

module.exports = {
    onRouterTransitionStart,
};
