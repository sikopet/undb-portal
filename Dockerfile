FROM node:6.10.2-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git

WORKDIR /usr/src/app

COPY package.json bower.json .bowerrc .npmrc ./

RUN npm install

COPY . ./

ARG COMMIT
ENV COMMIT $COMMIT

ENV PORT 8000

EXPOSE 8000

CMD [ "node", "server" ]
