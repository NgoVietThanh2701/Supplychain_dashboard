import abiCrowdSale from './abis/crowdSale.json';
import abiSupllyChain from './abis/supplyChain.json';
import abiAGTToken from './abis/agtToken.json';
import { ethers } from "ethers";

export const CROWDSALE_ADDRESS: string = '0xb5894444c65B52d12cAD243002cBE961B885d628';
export const SUPPLYCHAIN_ADDRESS: string = '0x3D14431b9Fa9E8728Ca7B7F9341dfC90B3348345';
export const AGT_TOKEN_ADDRESS: string = '0x016C31223Bdb9454E277A042A924C37BBafe1E18';
export const getAbiAGTToken = () => abiAGTToken;
export const getAbiCrowSale = () => abiCrowdSale;
export const getAbiSupplyChain = () => abiSupllyChain;
export const rpcProvider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_NEXT_PUBLIC_RPC_TESTNET);