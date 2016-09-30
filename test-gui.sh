#!/usr/bin/env bash
set -e

BABEL_ENV=coverage npm run dev:build
npm run karma:single -- --reporters coverage,junit
mkdir -p ../results
mv ./test-results/*.xml ../results
