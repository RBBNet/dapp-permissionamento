import { AbiItem } from "web3";

export type ExtendedAbiItem = AbiItem & { name: string, stateMutability: string };