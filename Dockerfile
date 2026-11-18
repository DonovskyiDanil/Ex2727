<<<<<<< HEAD
FROM node:20-alpine
WORKDIR /app
COPY . .
CMD ["./start-dev.sh"]
=======
FROM node:18-alpine
RUN mkdir -p /squadhelp/app
WORKDIR /squadhelp/app
COPY . .
RUN chmod +x start-dev.sh
CMD start-dev.sh
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
