From node:18

WORKDIR /usr/src/fiverr-app

COPY package*.json .

RUN yarn install

COPY prisma ./prisma/

RUN yarn prisma generate

COPY . .

EXPOSE 3000
CMD ["yarn", "start"]