FROM alpine:latest as builder
WORKDIR /home/node/GUI
COPY package*.json ./
COPY source ./source
COPY webpack.config.js ./
COPY index.ejs .
RUN apk add npm && \
  apk add git && \
  npm install && \
  npm run postversion

FROM alpine:latest
WORKDIR /home/node/GUI
COPY --from=builder /home/node/GUI/targetdir .