import { Address } from "viem";
import {Chain, bsc, bscTestnet, mainnet} from 'viem/chains'

enum Contracts {
  bridge = "bridge",
  equity = "equity",
  mintingHub = "mintingHub",
  oracleFreeDollar = "oracleFreeDollar",
  roller = "roller",
  savings = "savings",
  usdt = "usdt",
}

export type AddressObject = {
  [chainId in Chain["id"]]?: Record<Contracts, Address>;
};

export const ADDRESS: AddressObject = {
  [bsc.id]: {
    oracleFreeDollar: "0x969D3B762c543909d6ADDC1b7330BDfdc6cc60e6",
    bridge: "0xAEaF85C740C7a6ee94183E848d0e557cB7FbeA47",
    usdt: "0x55d398326f99059fF775485246999027B3197955",
    equity: "0xc3f061175aDc0992290ec0FF4E28B59b364f3F61",
    mintingHub: "0x70e318f5066597868a9026ecccC0e04D693d0fbD",
    savings: "0xa654e6E3CC20B8421814Fc7Ffc80d8c4d8AF120b",
    roller: "0x19CF525f751012da6Be6DD2646d376b79DCfEb00",
    // wFPS: "0x5052D3Cc819f53116641e89b96Ff4cD1EE80B182",
  },
  [bscTestnet.id]: {
    oracleFreeDollar: "0xc97c78dbf7D51d50a8e3a423774ad6F921E9b599",
    bridge: "0x2AC1B767378fFDeC4a9f71429a6b5aabEe559e84",
    usdt: "0x0c89580f26951c06e392435364Cb5389194b031c",
    equity: "0x49ea9f8a532f62e0972587704f59ee7364173419",
    mintingHub: "0x3578dc0e62612d6c6cafec526ff6517c51128aed",
    savings: "0x9c8A9A2eB148703aF8e737De8A492b3C3A6540E3",
    roller: "0x3C672bA969D4eD2f9F3F39eeE4Fdfb40fce1c8f9",
    // wFPS: "0x5052D3Cc819f53116641e89b96Ff4cD1EE80B182",
  },
  [mainnet.id]: {
    oracleFreeDollar: "0x591cf237452497335a9850f49f747d95569eb3b1",
    bridge: "0x77007Bd7Fc9311180d7b4C6532E15d0FEAE5703E",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    equity: "0x0619f152892c9dd014086a02516c2545d6f6f747",
    mintingHub: "0xCA8D28D62d863f52795c9fdCaE73c6EEB0ff504C",
    savings: "0x07c9ed9a7f18d166e25a47a2ac321ad4db5c6b36",
    roller: "0x47db60dE931Cdc550A04DB3f1Dec079b9c77fd23",
  }
};
