import { Address } from "viem";
import {Chain, bsc, bscTestnet} from 'viem/chains'

export type AddressObject = {
  [chainId in Chain["id"]]?: { [key: string]: Address };
};

export const ADDRESS: AddressObject = {
  [bsc.id]: {
    oracleFreeDollar: "0xc97c78dbf7D51d50a8e3a423774ad6F921E9b599",
    bridge: "0x2A864A8aD758deB139750548f252D07e1cA64E9C",
    usdt: "0x55d398326f99059fF775485246999027B3197955",
    equity: "0x49eA9f8A532f62e0972587704F59ee7364173419",
    mintingHub: "0x3578dC0e62612d6c6cafec526ff6517c51128AeD",
    savings: "0x9c8A9A2eB148703aF8e737De8A492b3C3A6540E3",
    roller: "0x3C672bA969D4eD2f9F3F39eeE4Fdfb40fce1c8f9",
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
