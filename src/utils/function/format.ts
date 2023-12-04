import moment from 'moment'
import 'moment/locale/vi'

export const showShortAddress = (address: string, amount: number): string => {
   return `${address?.substring(0, amount)}...${address?.substring(
      address.length - amount,
      address.length
   )}`
}


export const formatTime = (createdAt: any) => {
   moment.locale('vi');
   return moment(createdAt).fromNow()
}