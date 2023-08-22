FROM node:18

WORKDIR /app

COPY package.json .
RUN yarn

RUN apt update
RUN apt install -y libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev
RUN apt install -y libasound2

COPY . .
RUN yarn build

CMD [ "yarn", "start" ]