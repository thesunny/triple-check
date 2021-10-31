# NPM Starter Kit

## Getting Started

```sh
# in your project root, initialize an empty git repo
git init

# Pull npm-starter-kit
git pull https://github.com/thesunny/npm-starter-kit.git

# Install dependencies
yarn
```

## Building your project

```sh
yarn build
```

## Publishing a new version

```sh
# Executes build, bumps version, and shows instructions on publishing
yarn prepublish

# Publish in namespaced to NPM for first time
# (--access required for first time in an @namespace/packace project)
npm publish --access=public

# Other publish
npm publish
```

## Testing

```sh
# Run unit tests in Jest continuously
yarn test:watch
```
