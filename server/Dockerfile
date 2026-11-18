<<<<<<< HEAD
ARG VERSION=22-alpine

FROM node:$VERSION

RUN npm install --global npm@11.6.2

=======
ARG VERSION=20-alpine

FROM node:$VERSION

>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
ARG NODE_ENV="development"

RUN mkdir /server \
    && mkdir -p /public/images

RUN mkdir -p /var/www/html/images 

WORKDIR /server

COPY package*.json ./

<<<<<<< HEAD
RUN npm ci
=======
RUN npm install -g nodemon
RUN npm install -g sequelize-cli

RUN npm install
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

RUN chown -R node:node /server/node_modules

COPY . .

EXPOSE 5001

<<<<<<< HEAD
CMD ["npm", "start"]
=======
CMD if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then npm install; fi && sequelize db:migrate && sequelize db:seed:all && npm start
# CMD npm start
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
