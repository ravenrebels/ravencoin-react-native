import React from "react";
import * as RavencoinHandler from "./_ravencoinhandler.js";
import config from "./config";

export function useAddressObjects(mnemonic) {
  const [addressObjects, setAddressObjects] = React.useState([]);

  //Naive and lazy, derive the first 2 external and internal addresses
  const temp = [];

  React.useEffect(() => {
    if (mnemonic) {
      //Generating the hd key is time consuming, so we do it once.
      const hdKey = RavencoinHandler.getHDKey(config.network, mnemonic);
      for (let position = 0; position < 2; position++) {
        const externalPath = "m/44'/175'/0'/0/" + position;
        const internalPath = "m/44'/175'/0'/1/" + position;
        const external = RavencoinHandler.getAddressByPath(
          config.network,
          hdKey,
          externalPath
        );
        const internal = RavencoinHandler.getAddressByPath(
          config.network,
          hdKey,
          internalPath
        );
        temp.push(external);
        temp.push(internal);
      }
    }

    setAddressObjects(temp);
  }, [mnemonic]); //run when mnemonic change

  return addressObjects;
}
