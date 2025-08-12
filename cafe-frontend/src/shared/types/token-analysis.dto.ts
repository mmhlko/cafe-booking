import { AnalysisSummary, SelectorFlag } from "./token";

export interface SecurityChecks {
  isHoneypot: boolean;
  canSell: boolean;
  canBuy: boolean;
  hasBlacklist: boolean;
  hasWhitelist: boolean;
  hasMintFunction: boolean;
  hasBurnFunction: boolean;
  hasPausable: boolean;
  hasOwnable: boolean;
  hasProxy: boolean;
  hasUpgradeable: boolean;
}

export interface ContractAnalysis {
  bytecodeHash: string;
  bytecodeLength: number;
  hasExternalCalls: boolean;
  hasDelegateCall: boolean;
  hasSelfDestruct: boolean;
}

export interface SelectorInfo {
  function: string;
  stateMutability: 'view' | 'nonpayable' | 'pure' | 'payable';
  arguments: string;
  fullFunctionName: string;
  flag: SelectorFlag;
}

export type TFunctionAnalysis = {
  function: string;
  stateMutability: 'view' | 'nonpayable' | 'pure' | 'payable';
  arguments: string;
  fullFunctionName: string;
  flag: SelectorFlag;
  isTrusted: boolean;
  isSuspicious: boolean;
  isScam: boolean;
}

export interface BytecodeAnalysis {
  functions?: {
    [selector: string]: TFunctionAnalysis;
  };
  summary?: AnalysisSummary;
}

export interface SimulationResults {
  canBuy: boolean;
  canSell: boolean;
  buyTax: number;
  sellTax: number;
  maxBuyAmount: string;
  maxSellAmount: string;
  estimatedGas: {
    buy: number;
    sell: number;
  };
}

export interface TokenAnalysisFull {
  tokenAddress: string;
  chain: string;
  basicInfo: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    deployer?: string;
    isVerified: boolean;
  };
  securityChecks: SecurityChecks;
  contractAnalysis: ContractAnalysis;
  bytecodeAnalysis: BytecodeAnalysis;
  riskScore: number;
  riskFactors: string[];
  recommendations: string[];
  timestamp: string;
}

export interface TokenAnalysisShortResult {
  tokenAddress: string;
  chain: string;
  functionAnalysis: {
    [key in SelectorFlag]: number;
  };
  timestamp: string;
}

export interface DeployerStrategy {
  name: string;
  flag: SelectorFlag;
}

export interface DeployerAnalysis {
  strategies?: DeployerStrategy[];
  summary?: AnalysisSummary;
}
