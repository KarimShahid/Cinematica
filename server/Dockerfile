FROM node:20-alpine

WORKDIR /app

# Copy only package.json first
COPY package*.json ./

# Install deps as root (default)
RUN npm ci --only=production

# Copy rest of the code
COPY . .


EXPOSE 5001


CMD ["node", "index.js"]