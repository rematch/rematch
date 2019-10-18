#!/bin/sh
# runs install on plugins
# prevents plugin tests from failing in CI

install_plugin_deps() {
  npm --prefix ./$1 install ./$1
}

run_typescript_compiler() {
  cd $1
  tsc
  cd ../..
}

echo 'installing plugin dependencies'

for plugin in 'plugins'/*; do
  echo 'PLUGIN: ' $plugin
  install_plugin_deps $plugin
  run_typescript_compiler $plugin
done
