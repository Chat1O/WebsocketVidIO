FROM node:18.15

WORKDIR /usr/src

COPY package*.json ./

RUN npm install

COPY ./server .

EXPOSE 3001

CMD node server/server.js