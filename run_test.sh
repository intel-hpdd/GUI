#!/usr/bin/env bash
set -e

. ~/.nvm/nvm.sh use 4
rm -rf node_modules
npm i -d

./test-gui.sh
./test-gulp.sh
