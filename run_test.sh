#!/usr/bin/env bash
set -ex

. ~/.nvm/nvm.sh
nvm use 4
npm i
./node_modules/karma/bin/karma start --browsers Chrome,Firefox --singleRun true --reporters dots,junit
mv test-results/*.xml ../results
