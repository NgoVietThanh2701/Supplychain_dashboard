import { useState, useEffect } from 'react'
import Header from '../../components/Public/Header'
import Footer from '../../components/Public/Footer';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel, button } from "@material-tailwind/react";
import DataTable from '../../components/Dashboard/DataTable';
import { columnDelveryHub } from '../../utils/data/colums';
import SupplyChainContract from '../../contracts/SupplyChainContract';
import StateProduct from '../../utils/data/statesProduct';
import { formatToEth, showShortAddress } from '../../utils/function/format';
import Loading from '../../components/Loading';

declare var window: any;
const nodata_img = require('../../utils/images/no-data.jpg');

const PurchaseForm = () => {

   const { currentUser } = useSelector((state: any) => state.user);

   const [web3Provider, setWeb3Provider] = useState<any>();
   const [address, setAddress] = useState('');
   const [activeTab, setActiveTab] = useState("transfer-delivery");
   const [productsShipByTPT, setProductsShipByTPT] = useState<any>([]);
   const [productsWarehouseDH, setProductsWarehouseDH] = useState<any>([]);
   const [productsShipByDH, setProductsShipByDH] = useState<any>([]);
   const [productPurchased, setProductPurchased] = useState<any>([]);
   const [isLoading, setIsLoadng] = useState(false);

   const onConnectMetamask = async () => {
      if (window.ethereum) {
         try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
            const accounts = await provider.send("eth_requestAccounts", []);
            if (accounts.length > 0) {
               const signer = provider.getSigner();
               const address = await signer.getAddress();
               if (address === currentUser?.addressWallet) {
                  // Lưu thông tin vào localStorage
                  localStorage.setItem("supplychain_address", address);
                  setWeb3Provider(provider);
                  setAddress(address)
               } else {
                  Swal.fire('Opps', 'Vui lòng kết nối với tài khoản đã đăng ký trước đó', 'error');
                  setAddress('');
                  setWeb3Provider(null);
                  localStorage.removeItem('supplychain_address');
               }
            } else {
               Swal.fire('Opps', 'Không tài khoản nào được chọn', 'error');
            }
         } catch (error) {
            console.log(error);
         }
      }
   }

   // get address from localStorage.
   useEffect(() => {
      const storedAddress = localStorage.getItem("supplychain_address");
      if (storedAddress) {
         setAddress(storedAddress);
         const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
         setWeb3Provider(provider);
      }
   }, []);

   const getProductsShipByTPT = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ShippedByThirdParty && data.customer === currentUser.addressWallet));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsShipByTPT(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProductsWarehouseDH = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ReceivedByDeliveryHub &&
            data.customer === currentUser?.addressWallet));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsWarehouseDH(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProductsShipByDeliveryHub = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ShippedByDeliveryHub && data.customer === currentUser.addressWallet));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsShipByDH(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProductsPurchased = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ReceivedByCustomer && data.customer === currentUser.addressWallet));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductPurchased(listProducts.reverse());
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
      getProductsShipByTPT();
      getProductsWarehouseDH();
      getProductsShipByDeliveryHub();
      getProductsPurchased();
   }, []);

   const handleConfirm = async (uid: number) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      try {
         setIsLoadng(true);
         const supplychainContract = new SupplyChainContract(web3Provider);
         await supplychainContract.receiveByCustomer(uid);
         setTimeout(() => {
            getProductsShipByDeliveryHub();
            getProductsPurchased();
         }, 3000);
         setIsLoadng(false)
      } catch (error) {
         setIsLoadng(false)
         console.log(error);
      }
   }

   const actionPayload = {
      field: 'action',
      headerName: 'Thao tác',
      width: 200,
      renderCell: (params: any) => (
         <button onClick={() => handleConfirm(params.row.uid)} className='text-white bg-bg-green px-3 py-1 rounded-md'>Nhận hàng</button>
      )
   }

   const actionEvaluate = {
      field: 'action',
      headerName: 'Thao tác',
      width: 200,
      renderCell: (params: any) => (
         <button className='text-white bg-bg-green px-3 py-1 rounded-md'>Đánh giá</button>
      )
   }

   const data = [
      {
         label: `Đã giao cho đơn vị vận chuyển (${productsShipByTPT.length})`,
         value: "transfer-delivery",
         desc: productsShipByTPT.length > 0 ?
            <DataTable columns={columnDelveryHub} rows={productsShipByTPT} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: `Đã đến kho trung chuyển (${productsWarehouseDH.length})`,
         value: "warehouse-delivery",
         desc: productsWarehouseDH.length > 0 ?
            <DataTable columns={columnDelveryHub} rows={productsWarehouseDH} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: `Đơn hàng đang giao đến bạn (${productsShipByDH.length})`,
         value: "waitfordelivery",
         desc: productsShipByDH.length > 0 ?
            (
               <>
                  {address ? <p className='text-green mb-3'>Kết nối ví thành công!</p> :
                     <button className='text-[#C82032] mb-3'
                        onClick={onConnectMetamask}>Kết nối Metamask</button>
                  }
                  <DataTable columns={columnDelveryHub.concat(actionPayload)} rows={productsShipByDH} />
               </>
            ) :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: `Đã mua (${productPurchased.length})`,
         value: "purchased",
         desc: productPurchased.length > 0 ?
            <DataTable columns={columnDelveryHub.concat(actionEvaluate)} rows={productPurchased} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
   ]

   return (
      <div className='font-rubik w-full flex flex-col items-center'>
         {isLoading && <Loading />}
         <Header />
         <div className='w-5/6 my-10'>
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
         <div className='w-full border-t-1 border-color mt-[100px]' />
         <Footer />
      </div>
   )
}

export default PurchaseForm