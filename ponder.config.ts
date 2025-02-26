import { createConfig } from "@ponder/core";
import "dotenv/config";
import { http, parseAbiItem } from "viem";

import {bsc, bscTestnet, mainnet} from 'viem/chains'

import { ADDRESS } from "./ponder.address";
import { ABIs } from 'abis'

// export const chain = (process.env.PONDER_PROFILE as string) == 'dev' ? bscTestnet : bsc;

const CONFIG = {
  [bsc.id]: {
    blockrange: 10000,
    maxRequestsPerSecond: 50,
    pollingInterval: 5_000,
    rpc: process.env.PONDER_RPC_URL_56 ?? bsc.rpcUrls.default.http[0],
    startMintingHub: 45094649,
    startOracleFreeDollar: 45094487,
    startSavings: 45094581,
  },
  [bscTestnet.id]: {
    blockrange: undefined,
    maxRequestsPerSecond: 25,
    pollingInterval: 5_000,
    rpc: process.env.PONDER_RPC_URL_97 ?? bscTestnet.rpcUrls.default.http[0],
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

const openPositionEvent = parseAbiItem(
  "event PositionOpened(address indexed owner,address indexed position,address original,address collateral)"
);

// const openPositionEvent = ABIs.MintingHub.find((a) => a.type === 'event' && a.name === 'PositionOpened');
// if (openPositionEvent === undefined) throw new Error('openPositionEventV2 not found.');

export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      maxRequestsPerSecond: CONFIG[mainnet.id].maxRequestsPerSecond,
      pollingInterval: CONFIG[mainnet.id].pollingInterval,
      transport: http(CONFIG[mainnet.id].rpc),
    },
    bsc: {
      chainId: 56,
      maxRequestsPerSecond: CONFIG[bsc.id].maxRequestsPerSecond,
      pollingInterval: CONFIG[bsc.id].pollingInterval,
      transport: http(CONFIG[bsc.id].rpc),
    },
    bscTestnet: {
      chainId: 97,
      maxRequestsPerSecond: CONFIG[bscTestnet.id].maxRequestsPerSecond,
      pollingInterval: CONFIG[bscTestnet.id].pollingInterval,
      transport: http(CONFIG[bscTestnet.id].rpc),
    },
  },
  contracts: {
    OracleFreeDollar: {
      abi: ABIs.OracleFreeDollar,
      network: {
        mainnet: {
          address: ADDRESS[mainnet.id]?.oracleFreeDollar,
          startBlock: CONFIG[mainnet.id].startOracleFreeDollar,
          maxBlockRange: CONFIG[mainnet.id].blockrange,
        },
        bsc: {
          address: ADDRESS[bsc.id]?.oracleFreeDollar,
          startBlock: CONFIG[bsc.id].startOracleFreeDollar,
          maxBlockRange: CONFIG[bsc.id].blockrange,
        },
        bscTestnet: {
          address: ADDRESS[bscTestnet.id]?.oracleFreeDollar,
          startBlock: CONFIG[bscTestnet.id].startOracleFreeDollar,
          maxBlockRange: CONFIG[bscTestnet.id].blockrange,
        },
      },
    },
    Equity: {
      abi: ABIs.Equity,
      network: {
        mainnet: {
          address: ADDRESS[mainnet.id]?.equity,
          startBlock: CONFIG[mainnet.id].startOracleFreeDollar,
          maxBlockRange: CONFIG[mainnet.id].blockrange,
        },
        bsc: {
          address: ADDRESS[bsc.id]?.equity,
          startBlock: CONFIG[bsc.id].startOracleFreeDollar,
          maxBlockRange: CONFIG[bsc.id].blockrange,
        },
        bscTestnet: {
          address: ADDRESS[bscTestnet.id]?.equity,
          startBlock: CONFIG[bscTestnet.id].startOracleFreeDollar,
          maxBlockRange: CONFIG[bscTestnet.id].blockrange,
        },
      },
    },
    MintingHub: {
      abi: ABIs.MintingHub,
      network: {
        mainnet: {
          address: ADDRESS[mainnet.id]?.mintingHub,
          startBlock: CONFIG[mainnet.id].startMintingHub,
          maxBlockRange: CONFIG[mainnet.id].blockrange,
        },
        bsc: {
          address: ADDRESS[bsc.id]?.mintingHub,
          startBlock: CONFIG[bsc.id].startMintingHub,
          maxBlockRange: CONFIG[bsc.id].blockrange,
        },
        bscTestnet: {
          address: ADDRESS[bscTestnet.id]?.mintingHub,
          startBlock: CONFIG[bscTestnet.id].startMintingHub,
          maxBlockRange: CONFIG[bscTestnet.id].blockrange,
        },
      },
    },
    Position: {
      abi: ABIs.Position,
      network: {
        mainnet: {
          startBlock: CONFIG[mainnet.id].startMintingHub,
          maxBlockRange: CONFIG[mainnet.id].blockrange,
          factory: {
            address: ADDRESS[mainnet.id]?.mintingHub,
            event: openPositionEvent,
            parameter: "position",
          },
        },
        bsc: {
          startBlock: CONFIG[bsc.id].startMintingHub,
          maxBlockRange: CONFIG[bsc.id].blockrange,
          factory: {
            address: ADDRESS[bsc.id]?.mintingHub,
            event: openPositionEvent,
            parameter: "position",
          },
        },
        bscTestnet: {
          startBlock: CONFIG[bscTestnet.id].startMintingHub,
          maxBlockRange: CONFIG[bscTestnet.id].blockrange,
          factory: {
            address: ADDRESS[bscTestnet.id]?.mintingHub,
            event: openPositionEvent,
            parameter: "position",
          },
        },
      },
    },
    Savings: {
      abi: ABIs.Savings,
      network: {
        mainnet: {
          address: ADDRESS[mainnet.id]?.savings,
          startBlock: CONFIG[mainnet.id].startSavings,
          maxBlockRange: CONFIG[mainnet.id].blockrange,
        },
        bsc: {
          address: ADDRESS[bsc.id]?.savings,
          startBlock: CONFIG[bsc.id].startSavings,
          maxBlockRange: CONFIG[bsc.id].blockrange,
        },
        bscTestnet: {
          address: ADDRESS[bscTestnet.id]?.savings,
          startBlock: CONFIG[bscTestnet.id].startSavings,
          maxBlockRange: CONFIG[bscTestnet.id].blockrange,
        },
      },
    },
    Roller: {
      abi: ABIs.PositionRoller,
      network: {
        mainnet: {
          address: ADDRESS[mainnet.id]?.roller,
          startBlock: CONFIG[mainnet.id].startMintingHub,
          maxBlockRange: CONFIG[mainnet.id].blockrange,
        },
        bsc: {
          address: ADDRESS[bsc.id]?.roller,
          startBlock: CONFIG[bsc.id].startMintingHub,
          maxBlockRange: CONFIG[bsc.id].blockrange,
        },
        bscTestnet: {
          address: ADDRESS[bscTestnet.id]?.roller,
          startBlock: CONFIG[bscTestnet.id].startMintingHub,
          maxBlockRange: CONFIG[bscTestnet.id].blockrange,
        },
      },
    },
  },
});
