import { Address } from "viem";
import { Chain, bsc } from "viem/chains";

export type AddressObject = {
  [chainId in Chain["id"]]?: { [key: string]: Address };
};

export const ADDRESS: AddressObject = {
  [bsc.id]: {
    oracleFreeDollar: "0x55899A4Cd6D255DCcAA84d67E3A08043F2123d7E",
    bridge: "0x5330B9275C9094555286998D20c96bc63a9A575f",
    usdt: "0x55d398326f99059fF775485246999027B3197955",
    equity: "0xeA38b0cD48fA781181FDAa37291e8d6668462261",
    mintingHub: "0xFe00054AF44E24f0B4bd49b1A2d2984C4264aabE",
    // wFPS: "0x5052D3Cc819f53116641e89b96Ff4cD1EE80B182",
  },
};
