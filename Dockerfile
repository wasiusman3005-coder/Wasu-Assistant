# ==============================================================================
# WASU LOVE OS - Production Dockerfile
# ==============================================================================
FROM node:22-alpine AS base

WORKDIR /app

# Install dependencies needed for sharp and native builds if needed
RUN apk add --no-cache python3 make g++

COPY package.json ./

# Install all dependencies
RUN npm install

# Copy application source code
COPY . .

# Build Vite frontend assets
RUN npm run build

# Expose server port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Start server
CMD ["npm", "start"]
