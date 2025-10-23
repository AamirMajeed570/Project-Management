# Use lightweight Node image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies first (better caching)
COPY package*.json ./
RUN npm install --production

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# Expose port 5000
EXPOSE 5000

# Start the app using compiled JS
CMD ["node", "dist/index.js"]
