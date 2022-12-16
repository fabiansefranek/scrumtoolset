FROM node:17-alpine
ENV NODE_ENV=production
COPY package*.json .
RUN npm ci
RUN npm install -g serve
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npx", "serve", "-s", "-p", "8080", "build"]