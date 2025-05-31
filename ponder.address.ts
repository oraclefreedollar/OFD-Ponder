import { Address } from "viem";
import {Chain, bsc, bscTestnet, mainnet, polygon, base} from 'viem/chains'

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
  [base.id]: {
    bridge: "0x62e9e41925E9e1973F219AE6784e7fDC6E54fE37",
    equity: "0xd97CF080d7f78c3b5e1a0Bd74F9D685cf2071a2C",
    mintingHub: "0xbab0c2a7b11357245b03A4e81E04435D3893c97E",
    oracleFreeDollar: "0x7479791022EB1030Bbc3B09F6575C5dB4dDc0b90",
    roller: "0xACEF382A305b850C1b2FA35521ddD57E5425045c",
    savings: "0x1CcaDD1577CDbB95f3C404FD22ccc82f3EF1531C",
    usdt: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
  [bsc.id]: {
    bridge: "0xAEaF85C740C7a6ee94183E848d0e557cB7FbeA47",
    equity: "0xc3f061175aDc0992290ec0FF4E28B59b364f3F61",
    mintingHub: "0x70e318f5066597868a9026ecccC0e04D693d0fbD",
    oracleFreeDollar: "0x969D3B762c543909d6ADDC1b7330BDfdc6cc60e6",
    roller: "0x19CF525f751012da6Be6DD2646d376b79DCfEb00",
    savings: "0xa654e6E3CC20B8421814Fc7Ffc80d8c4d8AF120b",
    usdt: "0x55d398326f99059fF775485246999027B3197955",
  },
  [bscTestnet.id]: {
    bridge: "0x2AC1B767378fFDeC4a9f71429a6b5aabEe559e84",
    equity: "0x49ea9f8a532f62e0972587704f59ee7364173419",
    mintingHub: "0x3578dc0e62612d6c6cafec526ff6517c51128aed",
    oracleFreeDollar: "0xc97c78dbf7D51d50a8e3a423774ad6F921E9b599",
    roller: "0x3C672bA969D4eD2f9F3F39eeE4Fdfb40fce1c8f9",
    savings: "0x9c8A9A2eB148703aF8e737De8A492b3C3A6540E3",
    usdt: "0x0c89580f26951c06e392435364Cb5389194b031c",
  },
  [mainnet.id]: {
    bridge: "0x77007Bd7Fc9311180d7b4C6532E15d0FEAE5703E",
    equity: "0x0619f152892c9dd014086a02516c2545d6f6f747",
    mintingHub: "0xCA8D28D62d863f52795c9fdCaE73c6EEB0ff504C",
    oracleFreeDollar: "0x591cf237452497335a9850f49f747d95569eb3b1",
    roller: "0x47db60dE931Cdc550A04DB3f1Dec079b9c77fd23",
    savings: "0x07c9ed9a7f18d166e25a47a2ac321ad4db5c6b36",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
  [polygon.id]: {
    bridge: "0xCA8D28D62d863f52795c9fdCaE73c6EEB0ff504C",
    equity: "0x35868f0c44f43d2f0b0ca1adc52b38937d0b1df9",
    mintingHub: "0x178C2Eb681943Ee06D1735ee1f4898aE42E8A03c",
    oracleFreeDollar: "0x9cfb3b1b217b41c4e748774368099dd8dd7e89a1",
    roller: "0x0465D5d4AbE0383322A33147317A2C0ed2fce8D8",
    savings: "0x204843b865D87eF85F72801784Bed3EFC15E7c1d",
    usdt: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  }
};
