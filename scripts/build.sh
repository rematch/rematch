# Build script to be used locally for now

# run tests
echo 'Running tests...'
npm run test
echo 'Everything checks out.'

echo 'Building libs...'

# core
echo 'Building core...'
npm install
mkdir -p lib
webpack --env build

# loading plugin
echo 'Building loading plugin...'
cd plugins/loading
npm install
mkdir -p lib
webpack --env build
cd ../..

# persist plugin
echo 'Building persist plugin...'
cd plugins/persist
npm install
mkdir -p lib
webpack --env build
cd ../..

echo 'Done!'
