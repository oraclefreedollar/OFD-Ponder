import { createConfig, rateLimit } from "@ponder/core";
import "dotenv/config";
import { http, parseAbiItem } from "viem";

import { bsc } from "viem/chains";

import { Equity } from "./abis/Equity";
import { MintingHub } from "./abis/MintingHub";
import { OracleFreeDollar } from "./abis/OracleFreeDollar";
import { Position } from "./abis/Position";

const chain = bsc;
const transport = rateLimit(
  http(
    (chain.id as number) === 56
      ? process.env.PONDER_RPC_URL_1
      : chain.rpcUrls.default.http[0]
  ),
  { requestsPerSecond: 25 }
);

console.log(transport);
const openPositionEvent = parseAbiItem(
  "event PositionOpened(address indexed owner,address indexed position,address ofd,address collateral,uint256 price)"
);

export default createConfig({
  networks: {
    bsc: {
      chainId: 56,
      transport,
    },
  },
  contracts: {
    OracleFreeDollar: {
      network: "bsc",
      abi: OracleFreeDollar,
      address: "0x55899A4Cd6D255DCcAA84d67E3A08043F2123d7E",
      startBlock: 37881973,
      maxBlockRange: 5000,
    },
    Equity: {
      network: "bsc",
      abi: Equity,
      address: "0xeA38b0cD48fA781181FDAa37291e8d6668462261",
      startBlock: 37881973,
      maxBlockRange: 5000,
    },
    MintingHub: {
      network: "bsc",
      abi: MintingHub,
      address: "0xFe00054AF44E24f0B4bd49b1A2d2984C4264aabE",
      startBlock: 37882077,
      maxBlockRange: 5000,
    },
    Position: {
      network: "bsc",
      abi: Position,
      factory: {
        address: "0xFe00054AF44E24f0B4bd49b1A2d2984C4264aabE",
        event: openPositionEvent,
        parameter: "position",
      },
      startBlock: 37882077,
      maxBlockRange: 5000,
    },
  },
});
