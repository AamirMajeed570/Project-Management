# -------- Stage 1: Build (with dev dependencies) --------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install all dependencies (dev + prod)
RUN npm install

# Copy source files
COPY . .

# Build TypeScript -> dist
RUN npm run build


# -------- Stage 2: Production (minimal runtime) --------
FROM node:20-alpine AS production

WORKDIR /app

# Copy only package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy compiled files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./

# Expose app port
EXPOSE 5000

# Run the compiled app
CMD ["node", "dist/index.js"]
