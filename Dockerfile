FROM node:alpine
WORKDIR /home/node/GUI
COPY package*.json ./
COPY source ./source
COPY webpack.config.js ./
COPY .babelrc ./
COPY index.ejs .
RUN npm install && \
    npm run postversion && \
    rm -rf source node_modules package*.json index.ejs webpack.config.js /root/.npm && \
    mv targetdir/* . && \
    rm -rf targetdir
