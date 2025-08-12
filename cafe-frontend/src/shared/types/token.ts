import { PoolOnchainInfo } from './pool';
import { BytecodeAnalysis, DeployerAnalysis, TokenAnalysisFull } from './token-analysis.dto';

export interface Token {
  address: string;
  chain: string;
  name: string;
  symbol: string;
  datetime: string;
  decimals?: number;
  totalSupply?: string;
  deployerEOA?: string;
  blockNumber?: number;
  transactionHash?: string;
  blockHash?: string;
  pools?: PoolOnchainInfo[];
  source?: TokenSource;
  analyses?: {
    bytecodeAnalysis?: BytecodeAnalysis;
    deployerAnalysis?: DeployerAnalysis;
    result?: SelectorFlag;
  }
}

export enum SelectorFlag {
  TRUSTED = 1,
  SUSPICIOUS = 2,
  SCAM = 3,
  GRAYSCALE = 4,
}

export type AnalysisSummary = {
  [key in SelectorFlag]: number;
}

export interface TokenAnalysisShortResult {
  tokenAddress: string;
  chain: string;
  functionAnalysis: AnalysisSummary;
  timestamp: string;
}

export interface DeployerAnalysisShortResult {
  tokenAddress: string;
  deployerAddress: string;
  chain: string;
  strategyAnalysis: AnalysisSummary;
  timestamp: string;
}

export enum TokenSource {
  SELF_DEPLOYED = 'self-deployed',
  FLAUNCH = 'flaunch',
  VIRTUALS = 'virtuals',
  CLIZA = 'cliza',
  ZORA = 'zora',
  CLANKER = 'clanker',
  PINKSALE = 'pinksale',
  WORMHOLE = 'wormhole',
  APESTORE = 'apestore',
  KOATOLOCKER = 'KingOfApes',
  NONAME1 = 'noname1',
  NONAME2 = 'noname2',
  UNKNOWN = 'unknown',
}

export enum PoolVersion {
  V2 = 'V2',
  V3 = 'V3',
  V4 = 'V4',
  NONE = 'none',
}

