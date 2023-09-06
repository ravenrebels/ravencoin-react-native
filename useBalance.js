import React from "react";
import { rpc } from "./rpc";

//Custom hook for balance
export function useBalance(tick, addresses) {
  console.log("Running update balance", tick);
  const [balance, setBalance] = React.useState(0);

  const method = "getaddressbalance";
  const params = [
    {
      addresses,
    },
  ];
  const promise = rpc(method, params);
  promise.then((rpcData) => {
    setBalance(rpcData.balance);
  });
  return balance;
}
