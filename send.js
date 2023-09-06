import { toAddresses } from "./toAddresses.js";
import * as RavencoinHandler from "./_ravencoinhandler.js";
import { rpc } from "./rpc.js";
import config from "./config";
/**
 * A very naive and simple send function.
 * Get the UTXOs for address objects
 * Create a raw transaction
 * Sign the transaction
 * Broadcast the transaction
 *
 * @param {*} addressObjects
 * @param {*} amount
 * @param {*} recipientAddress
 */
export async function send(addressObjects, amount, recipientAddress) {
  if (amount > 0 === false) {
    throw new Error("Amount must be larger than zero");
  }

  if (!recipientAddress) {
    throw new Error("Invalid recipient address");
  }
  console.log("Processing to address", recipientAddress);
  //Validate to address
  const validateRecipientAddress = await rpc("validateaddress", [
    recipientAddress,
  ]);

  if (validateRecipientAddress.isvalid !== true) {
    throw Error("Invalid recipient address");
  }

  //Get all UTXO, unspent transaction outputs
  const params = [
    {
      addresses: toAddresses(addressObjects),
    },
  ];
  const allUTXOs = await rpc("getaddressutxos", params);

  console.log("Nr of utxos", allUTXOs.length);

  //Example of creating and signing a transaction without sending it
  let totalAmount = 0;
  for (let utxo of allUTXOs) {
    totalAmount += utxo.satoshis / 100000000;
  }

  /**
   * UTXOs looks like this
   * [{"address": "n4k6unpHS7fBuZkrTr5fmdJ2Ub9jtmpKk1", "assetName": "RVN", "height": 1184341, "outputIndex": 0, "satoshis": 10000000000, "script": "76a914fec77e30aba0b291ab19c78f23b3b4d556ddc61288ac", "txid": "2a4732fae322f6bee07faf560e909858f3363a49b43e4e1a83a152ac14c5fca7"}]
   *
   */
  const FEE = 0.02; //TODO should not be hard coded

  //Create inputs for the transactions
  //Syntax: {"txid":"id","vout":n}
  const inputs = allUTXOs.map((utxo) => {
    return {
      txid: utxo.txid,
      vout: utxo.outputIndex,
    };
  });

  //Round the change amout,to get 97.9600 instead of 97.96000000000001
  const changeAmount = (totalAmount - amount - FEE).toFixed(4);
  const outputs = {};

  //Add the amount to be sent to recipient
  outputs[recipientAddress] = amount;

  const changeAddress = addressObjects[1].address; //Should we our first internal/change address
  //Add change
  outputs[changeAddress] = changeAmount;
  console.log("OUTPUTS", outputs);
  const rawTransaction = await rpc("createrawtransaction", [inputs, outputs]);

  console.log("Raw transaction", rawTransaction);

  const privateKeys = {};
  //Lets get the private keys for the addresses used in UTXOs
  allUTXOs.map((utxo) => {
    const address = utxo.address;
    const addressObject = addressObjects.find((ao) => ao.address === address);
    privateKeys[address] = addressObject.WIF;
  });

  console.log("Private keys", privateKeys);

  console.log("RavencoinHandler", RavencoinHandler);
  const signedTransaction = RavencoinHandler.signTransaction(
    config.network,
    rawTransaction,
    allUTXOs,
    privateKeys
  );

  console.log("Signed transaction", signedTransaction);
  return rpc("sendrawtransaction", [signedTransaction]);
  //OK lets sign the raw transaction
  //Syntax:   Signer.sign("rvn", raw, UTXOs, privateKeys);
  //More info here: https://www.npmjs.com/package/@ravenrebels/ravencoin-sign-transaction
}
