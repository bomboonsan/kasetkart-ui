FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  else \
    npm install; \
  fi

FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build application
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm build; \
  else \
    npm run build; \
  fi

FROM node:20-alpine AS runner
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })" || \
  node -e "require('http').get('http://localhost:3000', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

# Start application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]

