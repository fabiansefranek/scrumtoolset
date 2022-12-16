FROM node:17-alpine
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
ENV NODE_ENV=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]