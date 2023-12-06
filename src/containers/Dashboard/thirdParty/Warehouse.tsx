import React, { useState, useEffect } from 'react'
import DataTable from '../../../components/Dashboard/DataTable';
import { formatTime, formatToEth } from '../../../utils/function/format';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import StateProduct from '../../../utils/data/statesProduct';
import {
   Tabs,
   TabsHeader,
   TabsBody,
   Tab,
   TabPanel,
} from "@material-tailwind/react";
import { ethers } from 'ethers';
import { useOutletContext } from 'react-router-dom';

const nodata_img = require('../../../utils/images/no-data.jpg');

const Warehouse = () => {

   const web3Provider: ethers.providers.Web3Provider = useOutletContext();

   const [activeTab, setActiveTab] = useState("ordered");

   const [products, setProducts] = useState<any>([]);
   const [longitude, setLongitude] = useState('');
   const [latitude, setLatitude] = useState('');

   const getProductsShipByFarmer = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => data.productState === StateProduct.ShippedByFarmer);
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProducts(listProducts.reverse());
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
      getProductsShipByFarmer();
      getLocation();
   }, []);

   const getLocation = () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
         setLongitude(position.coords.longitude.toString());
         setLatitude(position.coords.latitude.toString());
      })
   }

   const handleConfirm = async (uid: number) => {
      const supplychainContract = new SupplyChainContract(web3Provider);
      const product = SupplyChainContract
      await supplychainContract.receiveByThirdParty(uid, longitude, latitude); here
   }

   const columns = [
      {
         field: 'uid',
         headerName: 'ID',
         width: 30
      },
      {
         field: 'code',
         headerName: 'Mã sản phẩm',
         width: 120,
      },
      {
         field: 'name',
         headerName: 'Tên',
         width: 100,
      },
      {
         field: 'images',
         headerName: 'Hình ảnh',
         renderCell: (params: any) => (
            <img className='rounded-full w-20' src={params.row.images} alt="" />
         )
      },
      {
         field: 'price',
         headerName: 'Giá (AGT)',
         width: 100
      },
      {
         field: 'category',
         headerName: 'Loại',
         width: 80
      },
      {
         field: 'description',
         headerName: 'Mô tả',
         width: 80
      },
      {
         field: 'quantity',
         headerName: 'Số lượng (Kg)',
         width: 100
      },
      {
         field: 'temp',
         headerName: 'Nhiệt độ (C)',
         width: 100
      },
      {
         field: 'humidity',
         headerName: 'Độ ẩm (%)',
         width: 80
      },
      {
         field: 'date',
         headerName: 'Ngày sản xuất',
         width: 115,
         renderCell: (params: any) => (
            <span>
               {formatTime(params.row.date * 1000)}
            </span>
         )
      },
      {
         field: 'action',
         headerName: 'Thao tác',
         width: 95,
         renderCell: (params: any) => (
            <button onClick={() => handleConfirm(params.row.uid)} className='bg-bg-green text-white rounded-md py-1 px-2'>
               Xác nhận
            </button>
         )
      }
   ]

   const data = [
      {
         label: "Đơn nhận hàng",
         value: "ordered",
         desc: products.length > 0 ?
            <DataTable columns={columns} rows={products} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: "Kho hàng",
         value: "warehouse",
         desc: products.length > 0 ?
            <DataTable columns={columns} rows={products} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
   ]



   return (
      <div className='w-auto bg-white mx-5 px-5 py-2 mt-8 rounded-lg'>
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
   );
}

export default Warehouse