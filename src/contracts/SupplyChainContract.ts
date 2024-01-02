import { ethers } from "ethers";
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
   async harvestedProduct(name: string, code: string, price: number, category: string, images: string, description: string, quantity: number, longitude: string, latitude: string, temp: string, humidity: number, farmerCode: string) {
      await this._contract.harvestedProduct(name, code, this._parseToEth(price), category, images, description, quantity, longitude, latitude, temp, humidity, farmerCode, this._option);
   }

   // step 2: third party purschar product
   async purchaseByThirdParty(uid: number, thirdPartyCode: string) {
      await this._contract.purchaseByThirdParty(uid, thirdPartyCode, this._option);
   }

   // step 3: farmer ship -> third party
   async shipByFarmer(uid: number) {
      await this._contract.shipByFarmer(uid, this._option);
   }

   // step 4: third party -> receive product from farmer
   async receiveByThirdParty(uid: number, longitude: string, latitude: string) {
      await this._contract.receiveByThirdParty(uid, longitude, latitude, this._option);
   }

   // step 5: thirdparty -> add price for sold product
   async sellByThirdParty(uid: number, price: number) {
      await this._contract.sellByThirdParty(uid, this._parseToEth(price), this._option);
   }

   // step 6: customer buy product
   async purchaseByCustomer(uid: number, feeShip: number, addressShip: string, customerCode: string) {
      await this._contract.purchaseByCustomer(uid, this._parseToEth(feeShip), addressShip, customerCode, this._option);
   }

   // step 7: third party ship product
   async shipByThirdParty(uid: number) {
      await this._contract.shipByThirdParty(uid, this._option);
   }

   // step 8: delivery hub receive product
   async receiveByDeliveryHub(uid: number, longitude: string, latitude: string, deliveryHubCode: string) {
      await this._contract.receiveByDeliveryHub(uid, longitude, latitude, deliveryHubCode, this._option);
   }
   // step 9: delivery ship product to customer
   async shipByDeliveryHub(uid: number) {
      await this._contract.shipByDeliveryHub(uid, this._option);
   }

   // step 10: customer confirm receive product
   async receiveByCustomer(uid: number) {
      await this._contract.receiveByCustomer(uid, this._option);
   }

   async getProductByCode(code: string) {
      const product = await this._contract.getProductByCode(code, this._option);
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