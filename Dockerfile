# Stage 1: Build the React application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package*.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the application with NGINX
FROM nginx:1.25.3

# Copy the build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html