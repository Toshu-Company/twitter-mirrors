FROM node:18

WORKDIR /app

COPY package.json .
RUN yarn

COPY . .
RUN yarn build

RUN apt update
RUN apt install -y libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev
RUN apt install -y libasound2

CMD [ "yarn", "start" ]