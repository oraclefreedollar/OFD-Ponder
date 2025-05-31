import {createConfig} from '@ponder/core'
import 'dotenv/config'
import {http, parseAbiItem} from 'viem'

import {base, bsc, bscTestnet, mainnet, polygon} from 'viem/chains'

import {ADDRESS} from './ponder.address'
import {ABIs} from './abis'
import {CONFIG} from './config'

const openPositionEvent = parseAbiItem(
  "event PositionOpened(address indexed owner,address indexed position,address original,address collateral)"
);

export default createConfig({
  networks: {
    base: {
      chainId: 8453,
      maxRequestsPerSecond: CONFIG[base.id].maxRequestsPerSecond,
      pollingInterval: CONFIG[base.id].pollingInterval,
      transport: http(CONFIG[base.id].rpc),
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
    mainnet: {
      chainId: 1,
      maxRequestsPerSecond: CONFIG[mainnet.id].maxRequestsPerSecond,
      pollingInterval: CONFIG[mainnet.id].pollingInterval,
      transport: http(CONFIG[mainnet.id].rpc),
    },
    polygon: {
      chainId: 137,
      maxRequestsPerSecond: CONFIG[polygon.id].maxRequestsPerSecond,
      pollingInterval: CONFIG[polygon.id].pollingInterval,
      transport: http(CONFIG[polygon.id].rpc),
    },
  },
  contracts: {
    OracleFreeDollar: {
      abi: ABIs.OracleFreeDollar,
      network: {
        base: {
          address: ADDRESS[base.id]?.oracleFreeDollar,
          startBlock: CONFIG[base.id].startOracleFreeDollar,
          maxBlockRange: CONFIG[base.id].blockrange,
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
        mainnet: {
          address: ADDRESS[mainnet.id]?.oracleFreeDollar,
          startBlock: CONFIG[mainnet.id].startOracleFreeDollar,
          maxBlockRange: CONFIG[mainnet.id].blockrange,
        },
        polygon: {
          address: ADDRESS[polygon.id]?.oracleFreeDollar,
          startBlock: CONFIG[polygon.id].startOracleFreeDollar,
          maxBlockRange: CONFIG[polygon.id].blockrange,
        },
      },
    },
    Equity: {
      abi: ABIs.Equity,
      network: {
        base: {
          address: ADDRESS[base.id]?.equity,
          startBlock: CONFIG[base.id].startOracleFreeDollar,
          maxBlockRange: CONFIG[base.id].blockrange,
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
        mainnet: {
          address: ADDRESS[mainnet.id]?.equity,
          startBlock: CONFIG[mainnet.id].startOracleFreeDollar,
          maxBlockRange: CONFIG[mainnet.id].blockrange,
        },
        polygon: {
          address: ADDRESS[polygon.id]?.equity,
          startBlock: CONFIG[polygon.id].startOracleFreeDollar,
          maxBlockRange: CONFIG[polygon.id].blockrange,
        },

      },
    },
    MintingHub: {
      abi: ABIs.MintingHub,
      network: {
        base: {
          address: ADDRESS[base.id]?.mintingHub,
          startBlock: CONFIG[base.id].startMintingHub,
          maxBlockRange: CONFIG[base.id].blockrange,
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
        mainnet: {
          address: ADDRESS[mainnet.id]?.mintingHub,
          startBlock: CONFIG[mainnet.id].startMintingHub,
          maxBlockRange: CONFIG[mainnet.id].blockrange,
        },
        polygon: {
          address: ADDRESS[polygon.id]?.mintingHub,
          startBlock: CONFIG[polygon.id].startMintingHub,
          maxBlockRange: CONFIG[polygon.id].blockrange,
        },
      },
    },
    Position: {
      abi: ABIs.Position,
      network: {
        base: {
          startBlock: CONFIG[base.id].startMintingHub,
          maxBlockRange: CONFIG[base.id].blockrange,
          factory: {
            address: ADDRESS[base.id]?.mintingHub,
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
        mainnet: {
          startBlock: CONFIG[mainnet.id].startMintingHub,
          maxBlockRange: CONFIG[mainnet.id].blockrange,
          factory: {
            address: ADDRESS[mainnet.id]?.mintingHub,
            event: openPositionEvent,
            parameter: "position",
          },
        },
        polygon: {
          startBlock: CONFIG[polygon.id].startMintingHub,
          maxBlockRange: CONFIG[polygon.id].blockrange,
          factory: {
            address: ADDRESS[polygon.id]?.mintingHub,
            event: openPositionEvent,
            parameter: "position",
          },
        },
      },
    },
    Savings: {
      abi: ABIs.Savings,
      network: {
        base: {
          address: ADDRESS[base.id]?.savings,
          startBlock: CONFIG[base.id].startSavings,
          maxBlockRange: CONFIG[base.id].blockrange,
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
        mainnet: {
          address: ADDRESS[mainnet.id]?.savings,
          startBlock: CONFIG[mainnet.id].startSavings,
          maxBlockRange: CONFIG[mainnet.id].blockrange,
        },
        polygon: {
          address: ADDRESS[polygon.id]?.savings,
          startBlock: CONFIG[polygon.id].startSavings,
          maxBlockRange: CONFIG[polygon.id].blockrange,
        },
      },
    },
    Roller: {
      abi: ABIs.PositionRoller,
      network: {
        base: {
          address: ADDRESS[base.id]?.roller,
          startBlock: CONFIG[base.id].startMintingHub,
          maxBlockRange: CONFIG[base.id].blockrange,
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
        mainnet: {
          address: ADDRESS[mainnet.id]?.roller,
          startBlock: CONFIG[mainnet.id].startMintingHub,
          maxBlockRange: CONFIG[mainnet.id].blockrange,
        },
        polygon: {
          address: ADDRESS[polygon.id]?.roller,
          startBlock: CONFIG[polygon.id].startMintingHub,
          maxBlockRange: CONFIG[polygon.id].blockrange,
        },
      },
    },
  },
});
