FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

# Build application
FROM base AS build
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
ARG NEXT_PUBLIC_PUBLICAPI_URL
ENV NEXT_PUBLIC_PUBLICAPI_URL=${NEXT_PUBLIC_PUBLICAPI_URL}
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build

# Production dependencies only
FROM base AS production-deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Final production image with Next.js server
FROM node:20-alpine AS deploy
WORKDIR /app

# Copy built application and production dependencies
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.mjs ./next.config.mjs
COPY --from=production-deps /app/node_modules ./node_modules

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node_modules/.bin/next", "start"]

