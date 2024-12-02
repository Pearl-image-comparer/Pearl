FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json .
RUN npm ci --omit=dev --ignore-scripts

COPY --from=build /app/build ./build

CMD [ "npm", "start" ]
EXPOSE 3000
