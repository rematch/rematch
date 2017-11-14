install_deps () {
  npm --prefix ./$1 install ./$1
}

echo 'installing plugin dependencies'

for plugin in 'plugins'/*
do
 install_deps $plugin
done

echo 'installing package dependencies'

for package in 'packages'/*
do
 install_deps $package
done
