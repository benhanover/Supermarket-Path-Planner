# Step 1: Build the Next.js application
FROM node:18 as builder

WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Step 2: Set up a Node.js server to run Next.js and serve SSR
FROM node:18-slim as production

WORKDIR /app

# Set NODE_ENV to production for optimized performance
ENV NODE_ENV=production

# Copy only necessary files for production (build output and package files)
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/package.json /app/package-lock.json /app/

# Install only production dependencies
RUN npm install --only=production && \
    npm cache clean --force  # Clean up npm cache to reduce image size

# Expose the app on port 3000 (default for Next.js)
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start"]
