# Multi-stage build for minimal production image
FROM oven/bun:canary-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package.json ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Generate Prisma client
RUN bunx prisma generate

# Build the application to a single executable
RUN bun build --compile --target=bun-linux-x64 --outfile=server ./src/index.ts

# Production stage - minimal runtime image
FROM alpine:latest

# Install only required runtime dependencies
RUN apk add --no-cache ca-certificates

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy the compiled binary and necessary files
COPY --from=builder --chown=nodejs:nodejs /app/server /app/server
COPY --from=builder --chown=nodejs:nodejs /app/prisma /app/prisma

USER nodejs

EXPOSE 5000

# Run the compiled binary
CMD ["./server"]