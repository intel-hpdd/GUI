#!/usr/bin/env bash
set -e

. ~/.nvm/nvm.sh
nvm use 6
rm -rf node_modules
yarn install

./test-gui.sh
./test-gulp.sh
