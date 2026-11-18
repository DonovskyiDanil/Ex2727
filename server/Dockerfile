ARG VERSION=22-alpine

FROM node:$VERSION

RUN npm install --global npm@11.6.2

ARG NODE_ENV="development"

RUN mkdir /server \
    && mkdir -p /public/images

RUN mkdir -p /var/www/html/images 

WORKDIR /server

COPY package*.json ./

RUN npm ci

RUN chown -R node:node /server/node_modules

COPY . .

EXPOSE 5001

CMD ["npm", "start"]