import { useState, useEffect } from 'react'
import DataTable from '../../../components/Dashboard/DataTable';
import { formatTime, formatToEth } from '../../../utils/function/format';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import StateProduct from '../../../utils/data/statesProduct';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import { ethers } from 'ethers';
import { useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading';
import SellProductModal from '../../../components/Dashboard/thirdparty/SellProductModal';
import { columnFM } from '../farmer/OrderFM';
import { useSelector } from 'react-redux';
import { useStateContext } from '../../../contexts/ContextProvider';
import ReceiveProductModal from '../../../components/Dashboard/thirdparty/ReceiveProductModal';

const nodata_img = require('../../../utils/images/no-data.jpg');

const PurchaseTPT = () => {

   const { currentColor } = useStateContext();
   const web3Provider: ethers.providers.Web3Provider = useOutletContext();
   const { currentUser } = useSelector((state: any) => state.user);

   const [activeTab, setActiveTab] = useState("waiting-product");

   const [productWaitingConfirm, setProductWaitingConfirm] = useState<any>([]);
   const [productsShip, setProductsShip] = useState<any>([]);
   const [productsReceive, setProductsReceive] = useState<any>([]);
   const [products, setProducts] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [isOpenModalReceive, setIsOpenModalReceive] = useState(false);
   const [uid, setUid] = useState(0);
   const [price, setPrice] = useState(0);
   const [farmerCode, setFarmerCode] = useState('');

   const getProductsWaitingConfirm = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.PurchasedByThirdParty && data.thirdPartyDetails
            .thirdPartyCode === currentUser?.code));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductWaitingConfirm(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProductsShipByFarmer = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ShippedByFarmer && data.thirdPartyDetails
            .thirdPartyCode === currentUser?.code));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsShip(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProductsReceived = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ReceivedByThirdParty && data.thirdPartyDetails
            .thirdPartyCode === currentUser?.code));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsReceive(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProducts = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.SoldByThirdParty && data.thirdPartyDetails
            .thirdPartyCode === currentUser?.code));
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
         priceTPT: formatToEth(data.productDetails.priceThirdParty),
         farmerCode: data.farmerDetails.farmerCode,
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
         getProductsWaitingConfirm();
         getProductsShipByFarmer();
         getProductsReceived();
         getProducts();
      }
   }, [currentUser?.code]);

   const actionReceive = [
      {
         field: 'action',
         headerName: 'Thao tác',
         width: 95,
         renderCell: (params: any) => (
            <button onClick={() => openModalReveive(params.row.uid, params.row.price, params.row.farmerCode)} className='text-white rounded-md py-[5px] px-2'
               style={{ backgroundColor: currentColor }}>
               Nhận hàng
            </button>
         )
      }
   ]

   const openModalReveive = async (uid: number, price: number, farmerCode: string) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      setUid(uid);
      setPrice(price);
      setFarmerCode(farmerCode);
      setIsOpenModalReceive(true);
   }

   const handlePostSell = async (uid: number) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      setIsOpenModal(true);
      setUid(uid);
   }

   const actionWarehouse = [
      {
         field: 'action',
         headerName: 'Thao tác',
         width: 95,
         renderCell: (params: any) => (
            <button onClick={() => handlePostSell(params.row.uid)} className='text-white rounded-md py-1 px-2' style={{ backgroundColor: currentColor }}>
               Đăng bán
            </button>
         )
      }
   ]

   const data = [
      {
         label: `Chờ xác nhận đơn hàng (${productWaitingConfirm.length})`,
         value: "waiting-product",
         desc: productWaitingConfirm.length > 0 ?
            <DataTable columns={columnFM} rows={productWaitingConfirm} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: `Đơn hàng đang giao (${productsShip.length})`,
         value: "purchase",
         desc: productsShip.length > 0 ?
            <DataTable columns={columnFM.concat(actionReceive)} rows={productsShip} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: `Kho hàng (${productsReceive.length})`,
         value: "warehouse",
         desc: productsReceive.length > 0 ?
            <DataTable columns={columnFM.concat(actionWarehouse)} rows={productsReceive} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: `Sản phẩm (${products.length})`,
         value: "products",
         desc: products.length > 0 ?
            <DataTable columns={columnTPT} rows={products} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
   ]

   return (
      <div className='w-auto bg-white mx-5 px-5 py-2 mt-8 rounded-lg'>
         {isLoading && <Loading />}
         {isOpenModal && <SellProductModal setIsOpenModal={setIsOpenModal} uid={uid} getProductsReceived={getProductsReceived} getProducts={getProducts} />}
         {isOpenModalReceive && <ReceiveProductModal getProductsShipByFarmer={getProductsShipByFarmer} getProductsReceived={getProductsReceived} price={price} farmerCode={farmerCode} uid={uid} setIsOpenModalReceive={setIsOpenModalReceive} />}
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
   );
}

export default PurchaseTPT;

export const columnTPT = [
   {
      field: 'uid',
      headerName: 'ID',
      width: 20
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
      width: 135,
      renderCell: (params: any) => (
         <img className='rounded-full w-full h-full object-cover' src={params.row.images} alt="" />
      )
   },
   {
      field: 'price',
      headerName: 'Giá gốc',
      width: 90
   },
   {
      field: 'priceTPT',
      headerName: 'Giá bán',
      width: 90
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
      width: 115,
      renderCell: (params: any) => (
         <span>
            {formatTime(params.row.date * 1000)}
         </span>
      )
   },
]