#!/bin/bash -e

npm run postversion
pushd gulp
JASMINE_CONFIG_PATH=jasmine.json NODE_ENV=test RUNNER=CI ../node_modules/.bin/jasmine
popd
mv gulp/gulp-results.xml ./test-results
mkdir -p ../results
mv ./test-results/*.xml ../results
