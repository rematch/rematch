# Build script to be used locally for now

build_production () {
  npm install
  mkdir -p lib
  webpack --env build
}

build_plugin () {
  echo 'Building ' $1
  cp ./.babelrc ./$1/.babelrc
  cp ./.npmignore ./$1/.npmignore
  cp ./webpack.config.js ./$1/webpack.config.js
  cd $1
  build_production
  cd ../..
}

# install plugin deps
sh ./scripts/install.sh

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
