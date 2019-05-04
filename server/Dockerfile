FROM node:10.15-alpine
WORKDIR /server
COPY package.json /server
RUN npm install
COPY . /server
CMD node ./bin/www.js
EXPOSE 8082