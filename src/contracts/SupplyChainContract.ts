import { TransactionResponse } from "@ethersproject/abstract-provider";
import { Signer, ethers } from "ethers";
import BaseInterface from "./interfaces/BaseInterface";
import { rpcProvider, SUPPLYCHAIN_ADDRESS, getAbiSupplyChain } from "./config";

export default class SupplyChainContract extends BaseInterface {
   constructor(provider?: ethers.providers.Web3Provider) {
      super(provider || rpcProvider, SUPPLYCHAIN_ADDRESS, getAbiSupplyChain());
      if (!provider) {
         this._contract = new ethers.Contract(this._contractAddress, this._abi, rpcProvider);
      }
   }

   async addFarmer(address: string) {
      await this._contract.addFarmer(address, this._option);
   }

   async getAdmin(): Promise<string> {
      const address: string = (await this._contract.admin()).toString();
      return address;
   }

   async getProductByCode(code: string) {
      const product = await this._contract.getProductByCode(code);
      return product;
   }

   async getProductCount() {
      const count = await this._contract.getProductCount();
      return count._toNumber();
   }

   // async getProductState() {
   //    const productState = await this._contract.getProductState();
   //    return productState;
   // }

   async getProducts() {
      const products = await this._contract.getProducts();
      return products;
   }
}