import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BigNumber, Signer, ethers } from "ethers";
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

   async addCustomer(address: string) {
      await this._contract.addCustomer(address, this._option);
   }

   async addDeliveryHub(address: string) {
      await this._contract.addDeliveryHub(address, this._option);
   }

   async addThirdParty(address: string) {
      await this._contract.addThirdParty(address, this._option);
   }

   // step 1: famer -> harvested product 
   async harvestedProduct(name: string, code: string, price: BigNumber, category: string, images: string, description: string, quantity: number, longitude: string, latitude: string, temp: string, humidity: number) {
      await this._contract.harvestedProduct(name, code, price, category, images, description, quantity, longitude, latitude, temp, humidity, this._option)
   }

   // step 2: third party purschar product
   async purchaseByThirdParty(uid: number) {
      await this._contract.purchaseByThirdParty(uid, this._option);
   }

   // step 3: farmer ship -> third party
   async shipByFarmer(uid: number) {
      await this._contract.shipByFarmer(uid, this._option);
   }

   // step 4: third party -> receive product from farmer
   async receiveByThirdParty(uid: number, longitude: string, latitude: string) {
      await this._contract.receiveByThirdParty(uid, longitude, latitude, this._option);
   }

   async getProductByCode(code: string) {
      const product = await this._contract.getProductByCode(code);
      return product;
   }

   async getProductCount() {
      const count = await this._contract.getProductCount();
      return count._toNumber();
   }

   async getProducts() {
      const products = await this._contract.getProducts();
      return products;
   }

}