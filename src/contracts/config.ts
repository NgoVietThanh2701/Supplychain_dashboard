import abiCrowdSale from './abis/crowdSale.json';
import abiSupllyChain from './abis/supplyChain.json';
import abiAGTToken from './abis/agtToken.json';
import { ethers } from "ethers";

export const AGT_TOKEN_ADDRESS: string = '0x032e05833bF6B6F8CB175660108ae5be7881C3a1';
export const CROWDSALE_ADDRESS: string = '0x5AE2459A08cdc880E5A3d358C4d43714Aeefd953';
export const SUPPLYCHAIN_ADDRESS: string = '0x01A891BFc54961b615beAB876DacaD24B79bC451';
export const getAbiAGTToken = () => abiAGTToken;
export const getAbiCrowSale = () => abiCrowdSale;
export const getAbiSupplyChain = () => abiSupllyChain;
export const rpcProvider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_NEXT_PUBLIC_RPC_TESTNET);