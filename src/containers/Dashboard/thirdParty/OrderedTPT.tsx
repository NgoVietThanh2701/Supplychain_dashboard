import { useEffect, useState } from 'react'
import Loading from '../../../components/Loading';
import DataTable from '../../../components/Dashboard/DataTable';
import Swal from 'sweetalert2';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import { ethers } from 'ethers';
import { useOutletContext } from 'react-router-dom';
import StateProduct from '../../../utils/data/statesProduct';
import { formatToEth } from '../../../utils/function/format';
import { useSelector } from 'react-redux';
import { columnTPT } from './PurchaseTPT';
import { SUPPLYCHAIN_ADDRESS, getAbiSupplyChain } from '../../../contracts/config';
import { useStateContext } from '../../../contexts/ContextProvider';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";

const nodata_img = require('../../../utils/images/no-data.jpg');

const OrderedTPT = () => {

   const { currentColor } = useStateContext();
   const web3Provider: ethers.providers.Web3Provider = useOutletContext();
   const [productsOrder, setProductsOrder] = useState<any>([]);
   const [productsSold, setProductsSold] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(false);
   const { currentUser } = useSelector((state: any) => state.user);

   const [activeTab, setActiveTab] = useState("ordered");

   const getProductsOrdered = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.PurchasedByCustomer && data.thirdPartyDetails
            .thirdPartyCode === currentUser?.code));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsOrder(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProductsSold = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ReceivedByCustomer && data.thirdPartyDetails
            .thirdPartyCode === currentUser?.code));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsSold(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const convertObjectProduct = (data: any) => {
      return {
         uid: data.uid.toNumber(),
         productState: data.productState,
         name: data.productDetails.name,
         feeShip: formatToEth(data.customerDetails.feeShip),
         code: data.productDetails.code,
         price: formatToEth(data.productDetails.price),
         priceTPT: formatToEth(data.productDetails.priceThirdParty),
         category: data.productDetails.category,
         images: data.productDetails.images,
         description: data.productDetails.description,
         quantity: data.productDetails.quantity.toNumber(),
         temp: data.productDetails.temp,
         humidity: data.productDetails.humidity,
         date: data.productDetails.date.toNumber()
      }
   }

   useEffect(() => {
      if (currentUser?.code) {
         getProductsOrdered();
         getProductsSold();
      }
   }, [currentUser?.code]);

   const handleShipProduct = async (uid: number) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      try {
         setIsLoading(true);
         const supplychainContract = new SupplyChainContract(web3Provider);
         listenEvent();
         await supplychainContract.shipByThirdParty(uid);
      } catch (error) {
         setIsLoading(false)
         console.log(error)
      }
   }

   const listenEvent = () => {
      let contract = new ethers.Contract(SUPPLYCHAIN_ADDRESS, getAbiSupplyChain(), web3Provider);
      contract.once("ShippedByThirdParty", (uid) => {
         setIsLoading(false);
         getProductsOrdered();
      })
   }

   const action = {
      field: 'action',
      headerName: 'Thao tác',
      width: 80,
      renderCell: (params: any) => (
         <button onClick={() => handleShipProduct(params.row.uid)} className='text-white rounded-md px-4 py-1' style={{ backgroundColor: currentColor }}>
            Gửi
         </button>
      )
   }

   const data = [
      {
         label: `Đơn hàng (${productsOrder.length})`,
         value: "ordered",
         desc: productsOrder.length > 0 ?
            <DataTable columns={columnTPT.concat(action)} rows={productsOrder} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: `Đã bán (${productsSold.length})`,
         value: "sold",
         desc: productsSold.length > 0 ?
            <DataTable columns={columnTPT} rows={productsSold} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
   ]

   return (
      <div className='w-auto bg-white mx-5 px-5 py-5 mt-8 rounded-lg'>
         {isLoading && <Loading />}
         <Tabs value={activeTab}>
            <TabsHeader
               className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
               indicatorProps={{ className: "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none" }}>
               {data.map(({ label, value }) => (
                  <Tab key={value} value={value} onClick={() => setActiveTab(value)} className={activeTab === value ? "text-gray-900 border-b-2 border-green-600 " : ""} >
                     {label}
                  </Tab>
               ))}
            </TabsHeader>
            <TabsBody>
               {data.map(({ value, desc }) => (
                  <TabPanel key={value} value={value}>
                     {desc}
                  </TabPanel>
               ))}
            </TabsBody>
         </Tabs>
      </div>
   )
}

export default OrderedTPT;