#!/bin/bash -e

./node_modules/karma/bin/karma start --browsers Chrome,Firefox --singleRun true --reporters dots,junit
mkdir -p ../results
mv ./test-results/*.xml ../results
