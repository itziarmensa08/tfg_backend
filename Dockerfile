FROM node:21.7.1

RUN npm install -g ts-node typescript

RUN npm install -g nodemon

RUN npm install -g ts-node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4002

CMD ["npm", "run", "dev"]