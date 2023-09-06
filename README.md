# ravencoin-react-native

An example, how to use @ravenrebels JavaScript packages in React Native.
It is built using https://expo.dev

Basically, you need to use Browserify to bundle the packages, to make them work on IOS (and Android). See file `RavencoinHandler.js` and check script `buildRavencoinHandler` in `package.json`

To run on IOS simulator on mac
You need to install Xcode and IOS simulator (google it)

This naive and simple example demonstrate how to

- derives addresses from mnemonic
- use RPC to interact with the blockchain
- signs transactions

# clone the repo

- install dependencies `npm install`
- run `npm run build`
- run `npm start`
- <img width="436" alt="image" src="https://github.com/ravenrebels/ravencoin-react-native/assets/9694984/b5301ca8-7904-421c-8ab6-d5ad9e6a5d41">

