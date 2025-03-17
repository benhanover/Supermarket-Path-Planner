# Stage 1: Build the app
FROM node:18 as builder
WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app (Vite will output to 'dist' by default)
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:1.21
EXPOSE 80

# Copy the build output from the builder stage to Nginx's default HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: You can add a custom Nginx config if needed
# COPY nginx.conf /etc/nginx/nginx.conf
