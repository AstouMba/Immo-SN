# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

COPY . .

# Build-time DATABASE_URL only for prisma generate
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# openssl is required by the Prisma engine on alpine
RUN apk add --no-cache openssl

# Install all deps (including dev) so prisma CLI is available at runtime for migrations
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy generated Prisma client
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy compiled app, prisma schema/migrations, seed, start-prod script and uploads skeleton
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/uploads/.gitkeep ./uploads/.gitkeep

EXPOSE 4010

# Entrypoint runs migrations + seed + API
CMD ["node", "scripts/start-prod.mjs"]
