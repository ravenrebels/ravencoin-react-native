import { getRPC } from "@ravenrebels/ravencoin-rpc";

import config from "./config";

let url = "https://rvn-rpc-mainnet.ting.finance/rpc"; //default mainnet
if (config.network === "rvn-test") {
  url = "https://rvn-rpc-testnet.ting.finance/rpc";
}

export const rpc = getRPC("anon", "anon", url);
