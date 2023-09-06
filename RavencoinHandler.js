const { verifyMessage, sign } = require("@ravenrebels/ravencoin-message");
const SIGNER = require("@ravenrebels/ravencoin-sign-transaction");
const RavencoinWallet = require("@ravenrebels/ravencoin-jswallet");
const {
  entropyToMnemonic,
  getAddressPair,
  getHDKey,
  getAddressByPath,
  generateMnemonic,
  isMnemonicValid,
} = require("@ravenrebels/ravencoin-key");

module.exports = {
  toPrivateKey: function (privateKeyHex) {
    return Buffer.from(privateKeyHex, "hex");
  },
  entropyToMnemonic,
  generateMnemonic,
  getAddressByPath,
  getAddressPair,
  getHDKey,
  isMnemonicValid,
  sign,
  signTransaction: SIGNER.sign,
  verifyMessage,
  RavencoinWallet,
};
