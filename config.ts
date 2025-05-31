import {base, bsc, bscTestnet, mainnet, polygon} from 'viem/chains'

export const CONFIG = {
    [base.id]: {
        blockrange: 10000,
        maxRequestsPerSecond: 50,
        pollingInterval: 5_000,
        rpc: process.env.PONDER_RPC_URL_8453 ?? base.rpcUrls.default.http[0],
        startMintingHub: 24029389,
        startOracleFreeDollar: 24028855,
        startSavings: 24029143,
    },
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
    [polygon.id]: {
        blockrange: undefined,
        maxRequestsPerSecond: 25,
        pollingInterval: 5_000,
        rpc: process.env.PONDER_RPC_URL_137 ?? polygon.rpcUrls.default.http[0],
        startMintingHub: 66504194,
        startOracleFreeDollar: 66503833,
        startSavings: 66504114,
    },
}
