# Use an official Node image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the project
COPY . .

# Expose the port used by your Express app
EXPOSE 3000

# Start the server
CMD ["node", "app.js"]