import { BigNumber, ethers } from 'ethers'
import moment from 'moment'
import 'moment/locale/vi'

export const showShortAddress = (address: string, amount: number): string => {
   return `${address?.substring(0, amount)}...${address?.substring(
      address.length - amount,
      address.length
   )}`
}

export function capitalizeFirstLetter(string: string): string {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formatTime = (createdAt: any) => {
   moment.locale('vi');
   return moment(createdAt).fromNow()
}

export const parseToEth = (amount: number) => {
   return ethers.utils.parseEther(amount.toString());
}

export const formatToEth = (bigNumber: BigNumber) => {
   return Number.parseFloat(ethers.utils.formatEther(bigNumber))
}