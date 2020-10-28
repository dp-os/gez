function build ()
{
    echo "build ${1}"
    rm -rf ./node_modules/@fmfe/${1}/types
    rm -rf ./node_modules/@fmfe/${1}/dist

    NODE_ENV=production tsc --build packages/${1}/tsconfig.json
    cp -r ./packages/${1}/dist node_modules/@fmfe/${1}/dist
    cp -r ./packages/${1}/types node_modules/@fmfe/${1}/types
}

build genesis-core
build genesis-compiler
build genesis-app
build genesis-remote
build square
