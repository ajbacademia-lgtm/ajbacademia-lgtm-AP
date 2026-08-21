# Multi-stage Dockerfile for Google Cloud Run deployment

# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy application source files
COPY . .

# Run build script (produces dist/ static bundle and dist/server.cjs)
RUN npm run build

# Stage 2: Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled build output from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Start compiled CommonJS server
CMD ["node", "dist/server.cjs"]
