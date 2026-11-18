<<<<<<< HEAD
ARG VERSION=22-alpine

FROM node:$VERSION

RUN npm install --global npm@11.6.2

=======
ARG VERSION=20-alpine

FROM node:$VERSION

>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
ARG NODE_ENV="development"

RUN mkdir -p ./client

WORKDIR /client

COPY package*.json ./
<<<<<<< HEAD
RUN npm ci
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

COPY . .

EXPOSE 3000

<<<<<<< HEAD
RUN chown -R node:node /client/node_modules

CMD ["npm", "start"]
=======
RUN npm install

RUN chown -R node:node /client/node_modules

CMD npm start
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
