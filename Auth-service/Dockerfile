FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . . 

EXPOSE 5001


# Start the server
CMD ["node", "app.js"]