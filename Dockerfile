FROM mhart/alpine-node:8

ENV BASEPATH /opt/eth-certs
WORKDIR $BASEPATH

# copy source files
COPY . $BASEPATH

# one of the dependencies used (WebSocket-Node) requires them, so install it
RUN apk add --no-cache git make gcc g++ python

# download dependencies
RUN npm install --production

#expose port
EXPOSE 3000

# execute the app
CMD ["node", "app.js"]