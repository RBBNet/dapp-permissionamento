FROM node:14-alpine AS infra

WORKDIR /app

RUN apk update && apk upgrade && apk add --no-cache bash git yarn curl
RUN apk add --update python3 

COPY package.json .
COPY yarn.lock .
COPY .yarnrc .

RUN yarn install

COPY . .

RUN yarn run build

CMD ["yarn", "run", "start"]

EXPOSE 3000

