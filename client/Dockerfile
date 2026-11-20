ARG VERSION=22-alpine

FROM node:$VERSION

RUN npm install --global npm@11.6.2

ARG NODE_ENV="development"

RUN mkdir -p ./client

WORKDIR /client

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

RUN chown -R node:node /client/node_modules

CMD ["npm", "start"]
