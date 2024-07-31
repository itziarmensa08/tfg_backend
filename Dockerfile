FROM node:21.7.1

RUN npm install -g ts-node typescript

RUN npm install -g nodemon

RUN npm install -g ts-node

RUN apt-get update && apt-get install -y wget gnupg
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
RUN apt-get update && apt-get install -y mongodb-org-shell

RUN apt-get update && apt-get install telnet

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4002

CMD ["npm", "run", "dev"]