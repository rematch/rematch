install_plugin_deps () {
  npm --prefix ./$1 install ./$1
}

echo 'installing plugin dependencies'

for plugin in 'plugins'/*
do
 install_plugin_deps $plugin
done
