import { ethers } from "ethers";
import Erc20 from "./interfaces/Erc20Interface";
import { AGT_TOKEN_ADDRESS, getAbiAGTToken } from "./config";

export default class AGTContract extends Erc20 {
   constructor(provider: ethers.providers.Web3Provider) {
      super(provider, AGT_TOKEN_ADDRESS, getAbiAGTToken());
   }
}