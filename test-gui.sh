#!/bin/bash -e

npm run prepublish
pushd gulp
../node_modules/gulp/bin/gulp.js test:ci
popd
mkdir -p ../results
mv ./test-results/*.xml ../results
