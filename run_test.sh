#!/usr/bin/env bash -e

nvm use 4
rm -rf node_modules
npm i

./test-gui.sh
./test-gulp.sh
