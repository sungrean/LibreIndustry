# Industry Client Dockerfile
# Build: docker build -t industry-client .
# Run: docker run -p 3091:3091 industry-client

FROM node:20-alpine AS builder

# Install dependencies
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 3091

# Set environment
ENV HOST=0.0.0.0
ENV PORT=3091
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3091"]