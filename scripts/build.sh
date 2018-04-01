#!/bin/sh
# Build script to be used locally for now

build_production () {
  npm install
  mkdir -p lib
  npm run build
}

build_plugin () {
  echo 'Building ' $1
  cd $1
  build_production
  cd ../..
}

# install plugin deps
sh ./scripts/setup_plugins.sh

# run tests before building
echo 'Running tests...'
npm run test

# builds
echo 'Building libs...'
build_production

# build all plugins
for plugin in 'plugins'/*
do
  build_plugin $plugin
done

echo 'Done!'
