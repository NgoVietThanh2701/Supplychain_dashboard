import React, { useEffect, useState } from 'react'
import StateProduct from '../../../utils/data/statesProduct';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import { formatToEth, showShortAddress } from '../../../utils/function/format';
import Loading from '../../../components/Loading';
import DataTable from '../../../components/Dashboard/DataTable';
import { columnDelveryHub } from '../../../utils/data/colums';
import { ethers } from 'ethers';
import { useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import { useSelector } from 'react-redux';

const nodata_img = require('../../../utils/images/no-data.jpg');

const ReceiveDH = () => {

   const web3Provider: ethers.providers.Web3Provider = useOutletContext();
   const { currentUser } = useSelector((state: any) => state.user);

   const [productsShipByTPT, setProductsShipByTPT] = useState<any>([]);
   const [productsReceived, setProductsReceived] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [longitude, setLongitude] = useState('');
   const [latitude, setLatitude] = useState('');
   const [activeTab, setActiveTab] = useState("ordered");

   const getProductsShipByTPT = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => data.productState === StateProduct.ShippedByThirdParty);
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsShipByTPT(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProductsReceived = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ReceivedByDeliveryHub &&
            data.deliveryHubDetails.deliveryHub === currentUser?.addressWallet));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsReceived(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const convertObjectProduct = (data: any) => {
      return {
         uid: data.uid.toNumber(),
         name: data.productDetails.name,
         from: showShortAddress(data.thirdPartyDetails.thirdParty, 5),
         to: showShortAddress(data.customer, 5),
         code: data.productDetails.code,
         feeShip: formatToEth(data.productDetails.feeShip),
         priceTPT: formatToEth(data.productDetails.priceThirdParty),
         images: data.productDetails.images,
         quantity: data.productDetails.quantity.toNumber(),
         date: data.productDetails.date.toNumber()
      }
   }

   useEffect(() => {
      if (currentUser?.addressWallet) {
         getProductsShipByTPT();
         getProductsReceived();
      }
   }, [currentUser?.addressWallet]);

   useEffect(() => {
      getLocation();
   }, [])

   const getLocation = () => {
      navigator.geolocation.getCurrentPosition(function (position) {
         setLongitude(position.coords.longitude.toString());
         setLatitude(position.coords.latitude.toString());
      },
         (error: any) => {
            // Xử lý khi người dùng không cho phép truy cập vị trí hoặc có lỗi khác xảy ra
            switch (error.code) {
               case error.PERMISSION_DENIED:
                  Swal.fire('Opps!', 'Vui lòng thêm quyền truy cập vị trí', 'error');
                  break;
            }
         })
   }

   const handleConfirm = async (uid: number) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      try {
         setIsLoading(true);
         const supplychainContract = new SupplyChainContract(web3Provider);
         await supplychainContract.receiveByDeliveryHub(uid, longitude, latitude);
         setTimeout(() => {
            getProductsShipByTPT();
            getProductsReceived();
         }, 2500);
         setIsLoading(false);
      } catch (error) {
         setIsLoading(false);
         console.log(error);
      }
   }

   const handleShip = async (uid: number) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      try {
         setIsLoading(true);
         const supplychainContract = new SupplyChainContract(web3Provider);
         await supplychainContract.shipByDeliveryHub(uid);
         setTimeout(() => {
            getProductsReceived();
         }, 2500);
         setIsLoading(false);
      } catch (error) {
         setIsLoading(false);
         console.log(error);
      }
   }

   const actionReceive = {
      field: 'action',
      headerName: 'Thao tác',
      width: 80,
      renderCell: (params: any) => (
         <button onClick={() => handleConfirm(params.row.uid)} className='text-white bg-bg-green rounded-md px-3 py-1'>
            Nhận
         </button>

      )
   }

   const actionShip = {
      field: 'action',
      headerName: 'Thao tác',
      width: 80,
      renderCell: (params: any) => (
         <button onClick={() => handleShip(params.row.uid)} className='text-white bg-bg-green rounded-md px-4 py-1'>
            Gửi
         </button>

      )
   }

   const data = [
      {
         label: `Đơn hàng quanh đây (${productsShipByTPT.length})`,
         value: "ordered",
         desc: productsShipByTPT.length > 0 ?
            <DataTable columns={columnDelveryHub.concat(actionReceive)} rows={productsShipByTPT} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: `Kho hàng (${productsReceived.length})`,
         value: "warehouse",
         desc: productsReceived.length > 0 ?
            <DataTable columns={columnDelveryHub.concat(actionShip)} rows={productsReceived} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
   ]

   return (
      <div className='w-auto bg-white mx-5 px-5 py-2 mt-8 rounded-lg'>
         {isLoading && <Loading />}
         <Tabs value={activeTab}>
            <TabsHeader
               className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
               indicatorProps={{ className: "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none" }}>
               {data.map(({ label, value }) => (
                  <Tab key={value} value={value} onClick={() => setActiveTab(value)} className={activeTab === value ? "text-gray-900 border-b-2 border-green-600" : ""}>
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

export default ReceiveDH