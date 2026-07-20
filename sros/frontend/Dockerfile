# Base Node image
FROM node:20-alpine

WORKDIR /app

# Copy dependency configs
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment
ENV PORT=3000
ENV NODE_ENV=production

# Start application
CMD ["npm", "run", "start"]
