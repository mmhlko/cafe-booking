import { PoolVersion } from "./token";

export interface PoolOnchainInfo {
  address: string;
  factoryAddress: string;
  routerAddress: string;
  token0: string;
  token1: string;
  poolVersion: PoolVersion;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  creator: string;
  datetime: string;
  chain: string;
  reserve0: string;
  reserve1: string;
  hasInitialLiquidity: boolean;
}