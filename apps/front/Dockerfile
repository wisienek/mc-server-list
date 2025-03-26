FROM node:23.9-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN npm install -g nx@latest

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env.production .env.production

RUN rm -rf .next node_modules/.cache dist

RUN npx nx run front:build

RUN cp -r apps/front/public apps/front/.next/standalone/apps/front && \
    cp -r apps/front/.next/static apps/front/.next/standalone/apps/front/.next/

FROM base AS runner

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app/apps/front

COPY --from=builder --chown=nextjs:nodejs /app/apps/front/.next/standalone/apps/front ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/front/.next/standalone/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/apps/front/.next/standalone/node_modules ./node_modules

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
