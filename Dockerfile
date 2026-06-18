FROM node:18-alpine
RUN mkdir -p /squadhelp/app
WORKDIR /squadhelp/app
COPY . .
RUN chmod +x start-dev.sh
CMD start-dev.sh
