FROM node:18-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci --cache /tmp/.npm --prefer-offline

COPY . .

CMD ["npm", "run", "start"]
