FROM node:10.16.0-alpine

ADD . /app/
WORKDIR /app/

COPY package.json .

RUN npm install --quiet
RUN npm run populate

COPY . .

