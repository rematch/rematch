install_deps () {
  npm --prefix ./$1 install ./$1
}

echo 'installing plugin dependencies'

for plugin in 'plugins'/*
do
 install_deps $plugin
done

echo 'installing experiment dependencies'

for experiment in 'experiments'/*
do
 install_deps $experiment
done
