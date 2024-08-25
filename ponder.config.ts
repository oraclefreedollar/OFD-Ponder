import { createConfig } from "@ponder/core";
import "dotenv/config";
import { Address, http, parseAbiItem } from "viem";

import { bsc } from "viem/chains";

import { Equity } from "./abis/Equity";
import { MintingHub } from "./abis/MintingHub";
import { OracleFreeDollar } from "./abis/OracleFreeDollar";
import { Position } from "./abis/Position";

import { ADDRESS } from "./ponder.address";

const chain = bsc;

const CONFIG = {
  [bsc.id]: {
    rpc: process.env.RPC_URL_MAINNET ?? bsc.rpcUrls.default.http[0],
    startBlockA: 37881973,
    startBlockB: 37882077,
    blockrange: undefined,
    maxRequestsPerSecond: 5,
    pollingInterval: 5_000,
  },
};

const openPositionEvent = parseAbiItem(
  "event PositionOpened(address indexed owner,address indexed position,address ofd,address collateral,uint256 price)"
);

export default createConfig({
  networks: {
    [chain.name]: {
      chainId: chain.id,
      maxRequestsPerSecond: CONFIG[chain.id].maxRequestsPerSecond,
      pollingInterval: CONFIG[chain.id].pollingInterval,
      transport: http(CONFIG[chain!.id].rpc),
    },
  },
  contracts: {
    OracleFreeDollar: {
      network: chain.name,
      abi: OracleFreeDollar,
      address: ADDRESS[chain!.id]!.oracleFreeDollar as Address,
      startBlock: CONFIG[chain!.id].startBlockA,
      maxBlockRange: CONFIG[chain!.id].blockrange,
    },
    Equity: {
      network: chain.name,
      abi: Equity,
      address: ADDRESS[chain!.id]!.equity as Address,
      startBlock: CONFIG[chain!.id].startBlockA,
      maxBlockRange: CONFIG[chain!.id].blockrange,
    },
    MintingHub: {
      network: chain.name,
      abi: MintingHub,
      address: ADDRESS[chain!.id]!.mintingHub as Address,
      startBlock: CONFIG[chain!.id].startBlockB,
      maxBlockRange: CONFIG[chain!.id].blockrange,
    },
    Position: {
      network: chain.name,
      abi: Position,
      factory: {
        address: ADDRESS[chain!.id]!.mintingHub as Address,
        event: openPositionEvent,
        parameter: "position",
      },
      startBlock: CONFIG[chain!.id].startBlockB,
      maxBlockRange: CONFIG[chain!.id].blockrange,
    },
  },
});
