FROM node:23.9-alpine AS base

FROM base AS deps

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN npm install -g nx@latest

FROM base AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN rm -rf .next dist

RUN npx nx run server:build

FROM base AS serve

WORKDIR /app

EXPOSE 3000

ENV APP_PORT=3000

ENV NO_COLOR=true
ENV NODE_ENV=production

COPY --from=build /app/ ./

CMD ["node", "main.js"]
