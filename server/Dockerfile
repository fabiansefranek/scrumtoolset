FROM node:19-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN npm run test
CMD ["npm", "run", "dev"]