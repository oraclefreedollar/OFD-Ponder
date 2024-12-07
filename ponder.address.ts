import { Address } from "viem";
import {Chain, bsc, bscTestnet} from 'viem/chains'

export type AddressObject = {
  [chainId in Chain["id"]]?: { [key: string]: Address };
};

export const ADDRESS: AddressObject = {
  [bsc.id]: {
    oracleFreeDollar: "0x1A3f933e13649472d354373eE88FA10E88c1795e",
    bridge: "0xa40115628f38D5C6516e7A7ee6f423b6134B9e91",
    usdt: "0x55d398326f99059fF775485246999027B3197955",
    equity: "0xe910E600FfccfF8038A700908bdaE378484dc818",
    mintingHub: "0x06371Ea7ddD65455680083075160610f61b059FC",
    savings: "0x3db45a6c58D9419EB960ddD3470677fA2aBD8dF2",
    roller: "0x79c5C359060c255E314c9B2643A86cb155DEbCc1",
    // wFPS: "0x5052D3Cc819f53116641e89b96Ff4cD1EE80B182",
  },
  [bscTestnet.id]: {
    oracleFreeDollar: "0xFe00054AF44E24f0B4bd49b1A2d2984C4264aabE",
    bridge: "0xBDf6C6f4bB810BC48ECe781ED8377e7692843497",
    usdt: "0x4096831dC711C1A20aC011FBf0AA90A6c56dcF55",
    equity: "0xC13a9D41C67640929f525DE611DD9a85F68D2eF6",
    mintingHub: "0xF1baFdC4553086b4066A3Dd14D34C880d7f99a8C",
    savings: "0xE927bE85eDe0671FA0ecec38a564384F117a401E",
    roller: "0x5330B9275C9094555286998D20c96bc63a9A575f",
    // wFPS: "0x5052D3Cc819f53116641e89b96Ff4cD1EE80B182",
  },
};
