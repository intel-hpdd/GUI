#!/usr/bin/env bash -e

pushd gulp
../node_modules/gulp/bin/gulp.js dev:build
../node_modules/gulp/bin/gulp.js test:ci
popd
mkdir -p ../results
mv ./test-results/*.xml ../results
