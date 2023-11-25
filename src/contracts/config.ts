import abiCrowdSale from './abis/crowdSale.json';
import abiSupllyChain from './abis/supplyChain.json';
import { ethers } from "ethers";

export const CROWDSALE_ADDRESS: string = '0xb5894444c65B52d12cAD243002cBE961B885d628';
export const SUPPLYCHAIN_ADDRESS: string = '0x768D3f49E3619100cd85373D748b94A973ce7e7C';
export const getAbiCrowSale = () => abiCrowdSale;
export const getAbiSupplyChain = () => abiSupllyChain;
export const rpcProvider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_NEXT_PUBLIC_RPC_TESTNET);