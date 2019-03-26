FROM node:10

COPY . ./src/

RUN cd ./src && npm install

ENTRYPOINT ["node", "./src/checkNode.js"]
