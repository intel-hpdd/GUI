FROM alpine
WORKDIR /home/node/GUI
COPY package*.json ./
COPY source ./source
COPY webpack.config.js ./
COPY babel.config.js ./
COPY index.ejs .
RUN apk add npm && \
  apk add git && \
  npm install && \
  npm run postversion && \
  rm -rf source node_modules package*.json index.ejs webpack.config.js /root/.npm && \
  mv targetdir/* . && \
  rm -rf targetdir && \
  apk del npm