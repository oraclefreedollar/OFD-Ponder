import { createConfig } from "@ponder/core";
import "dotenv/config";
import { Address, http, parseAbiItem } from "viem";

import {bsc, bscTestnet, mainnet} from 'viem/chains'

import { ADDRESS } from "./ponder.address";
import { ABIs } from 'abis'

// export const chain = (process.env.PONDER_PROFILE as string) == 'dev' ? bscTestnet : bsc;
export const chain = mainnet;
export const Id = chain.id!;
export const ADDR = ADDRESS[chain.id]!;

export const CONFIG = {
  [bsc.id]: {
    blockrange: 10000,
    maxRequestsPerSecond: 50,
    pollingInterval: 5_000,
    rpc: process.env.PONDER_RPC_URL_1 ?? bsc.rpcUrls.default.http[0],
    startMintingHub: 45094649,
    startOracleFreeDollar: 45094487,
    startSavings: 45094581,
  },
  [bscTestnet.id]: {
    blockrange: undefined,
    maxRequestsPerSecond: 25,
    pollingInterval: 5_000,
    rpc: process.env.PONDER_RPC_URL_TESTNET ?? bscTestnet.rpcUrls.default.http[0],
    startMintingHub: 46376356,
    startOracleFreeDollar: 46376031,
    startSavings: 46376310,
  },
  [mainnet.id]: {
    blockrange: undefined,
    maxRequestsPerSecond: 25,
    pollingInterval: 5_000,
    rpc: process.env.PONDER_RPC_URL_1 ?? mainnet.rpcUrls.default.http[0],
    startMintingHub: 21587949,
    startOracleFreeDollar: 21587864,
    startSavings: 21587934,
  },
};

export const config = CONFIG[Id];

const openPositionEvent = parseAbiItem(
  "event PositionOpened(address indexed owner,address indexed position,address original,address collateral)"
);

// const openPositionEvent = ABIs.MintingHub.find((a) => a.type === 'event' && a.name === 'PositionOpened');
// if (openPositionEvent === undefined) throw new Error('openPositionEventV2 not found.');

export default createConfig({
  networks: {
    [chain.name]: {
      chainId: Id,
      maxRequestsPerSecond: CONFIG[Id].maxRequestsPerSecond,
      pollingInterval: CONFIG[Id].pollingInterval,
      transport: http(CONFIG[Id].rpc),
    },
  },
  contracts: {
    OracleFreeDollar: {
      network: chain.name,
      abi: ABIs.OracleFreeDollar,
      address: ADDR.oracleFreeDollar as Address,
      startBlock: config.startOracleFreeDollar,
      maxBlockRange: config.blockrange,
    },
    Equity: {
      network: chain.name,
      abi: ABIs.Equity,
      address: ADDR.equity as Address,
      startBlock: config.startOracleFreeDollar,
      maxBlockRange: config.blockrange,
    },
    MintingHub: {
      network: chain.name,
      abi: ABIs.MintingHub,
      address: ADDR.mintingHub as Address,
      startBlock: config.startMintingHub,
      maxBlockRange: config.blockrange,
    },
    Position: {
      network: chain.name,
      abi: ABIs.Position,
      factory: {
        address: ADDR.mintingHub as Address,
        event: openPositionEvent,
        parameter: "position",
      },
      startBlock: config.startMintingHub,
      maxBlockRange: config.blockrange,
    },
    Savings: {
      network: chain.name,
      abi: ABIs.Savings,
      address: ADDR.savings as Address,
      startBlock: config.startSavings,
      maxBlockRange: config.blockrange,
    },
    Roller: {
      network: chain.name,
      abi: ABIs.PositionRoller,
      address: ADDR.roller as Address,
      startBlock: config.startMintingHub,
      maxBlockRange: config.blockrange,
    },
  },
});
