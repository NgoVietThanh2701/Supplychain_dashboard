import React, { useState, useEffect } from 'react'
import DataTable from '../../../components/Dashboard/DataTable';
import { formatTime, formatToEth } from '../../../utils/function/format';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import StateProduct from '../../../utils/data/statesProduct';
import { ethers } from 'ethers';
import { useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading';
import { useSelector } from 'react-redux';
import { useStateContext } from '../../../contexts/ContextProvider';
import { SUPPLYCHAIN_ADDRESS, getAbiSupplyChain } from '../../../contracts/config';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";

const nodata_img = require('../../../utils/images/no-data.jpg');

const OrderFM = () => {

   const { currentColor } = useStateContext();

   const web3Provider: ethers.providers.Web3Provider = useOutletContext();
   const { currentUser } = useSelector((state: any) => state.user);
   const [productsOrdered, setProductsOrdered] = useState<any>([]);
   const [productsSold, setProductsSold] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(false);

   const [activeTab, setActiveTab] = useState("ordered");

   const getProductsOrdered = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.PurchasedByThirdParty && data.farmerDetails.farmerCode === currentUser?.code));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsOrdered(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProductsSold = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         console.log(response)
         const productFilted = response.filter((data: any) => (data.thirdPartyDetails.longitude !== "" && data.farmerDetails.farmerCode === currentUser?.code));
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
         code: data.productDetails.code,
         price: formatToEth(data.productDetails.price),
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

   const handleOrder = async (uid: number) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      try {
         setIsLoading(true);
         const supplychainContract = new SupplyChainContract(web3Provider);
         listenEvent();
         await supplychainContract.shipByFarmer(uid);
      } catch (error) {
         setIsLoading(false)
         console.log(error)
      }
   }

   const listenEvent = () => {
      let contract = new ethers.Contract(SUPPLYCHAIN_ADDRESS, getAbiSupplyChain(), web3Provider);
      contract.once("ShippedByFarmer", (uid) => {
         setIsLoading(false);
         getProductsOrdered();
         //getProductsSold();
      })
   }

   const action =
   {
      field: 'action',
      headerName: 'Thao tác',
      width: 110,
      renderCell: (params: any) => (
         <button onClick={() => handleOrder(params.row.uid)} className='text-white rounded-md px-3 py-1' style={{ backgroundColor: currentColor }}>
            Gửi hàng
         </button>

      )
   }

   const data = [
      {
         label: `Đơn hàng (${productsOrdered.length})`,
         value: "ordered",
         desc: productsOrdered.length > 0 ?
            <DataTable columns={columnFM.concat(action)} rows={productsOrdered} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: `Đã bán (${productsSold.length})`,
         value: "sold",
         desc: productsSold.length > 0 ?
            <DataTable columns={columnFM} rows={productsSold} /> :
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

export default OrderFM;

export const columnFM = [
   {
      field: 'uid',
      headerName: 'ID',
      width: 40
   },
   {
      field: 'code',
      headerName: 'Mã sản phẩm',
      width: 100,
   },
   {
      field: 'name',
      headerName: 'Tên',
      width: 100,
   },
   {
      field: 'images',
      headerName: 'Hình ảnh',
      width: 130,
      renderCell: (params: any) => (
         <img className='rounded-full w-full h-full object-cover' src={params.row.images} alt="" />
      )
   },
   {
      field: 'price',
      headerName: 'Giá',
      width: 80,
      renderCell: (params: any) => (
         <span>{params.row.price} AGT</span>
      )
   },
   {
      field: 'category',
      headerName: 'Loại',
      width: 100
   },
   {
      field: 'description',
      headerName: 'Mô tả',
      width: 100
   },
   {
      field: 'quantity',
      headerName: 'Số lượng',
      width: 70,
      renderCell: (params: any) => (
         <span>{params.row.quantity} Kg</span>
      )
   },
   {
      field: 'temp',
      headerName: 'Nhiệt độ',
      width: 80,
      renderCell: (params: any) => (
         <span>{Math.round(params.row.temp)} độ C</span>
      )
   },
   {
      field: 'humidity',
      headerName: 'Độ ẩm',
      width: 70,
      renderCell: (params: any) => (
         <span>{params.row.humidity} %</span>
      )
   },
   {
      field: 'date',
      headerName: 'Ngày sản xuất',
      width: 130,
      renderCell: (params: any) => (
         <span>
            {formatTime(params.row.date * 1000)}
         </span>
      )
   },
]