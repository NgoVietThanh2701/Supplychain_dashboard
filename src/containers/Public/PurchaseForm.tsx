import { useState, useEffect, useRef } from 'react'
import Header from '../../components/Public/Header'
import Footer from '../../components/Public/Footer';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import DataTable from '../../components/Dashboard/DataTable';
import SupplyChainContract from '../../contracts/SupplyChainContract';
import StateProduct from '../../utils/data/statesProduct';
import { formatToEth, showShortAddress } from '../../utils/function/format';
import Loading from '../../components/Loading';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { BsFillBackspaceReverseFill } from "react-icons/bs";
import { useJsApiLoader, GoogleMap, MarkerF, PolylineF, InfoBox, DirectionsRenderer, LoadScriptProps } from '@react-google-maps/api';
import { apiCreateStatistical } from '../../services/statistical';
import { SUPPLYCHAIN_ADDRESS, getAbiSupplyChain } from '../../contracts/config';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { apiGetInfoUser } from '../../services/userServices';

declare var window: any;
const nodata_img = require('../../utils/images/no-data.jpg');
const farmer_img = require('../../utils/images/farmer.png');
const broker_img = require('../../utils/images/broker.png');
const delivery_img = require('../../utils/images/delivery.png');
const options = { closeBoxURL: '', enableEventPropagation: true };
const optionsPolyline = {
   strokeColor: 'red',
   strokeOpacity: 0.8,
   strokeWeight: 3,
   fillColor: '#085daa',
   fillOpacity: 0.35,
   clickable: false,
   draggable: false,
   editable: false,
   visible: true,
   radius: 30000,
   zIndex: 1
};

const libraries: LoadScriptProps['libraries'] = ['places'];

const ModalViewProduct = ({ setIsOpenModal, product }: any) => {

   console.log(product)
   const [nameFarmer, setNameFarmer] = useState('');
   const [addressFarmer, setAddressFarmer] = useState('');
   const [nameTPT, setNameTPT] = useState('');
   const [addressTPT, setAddressTPT] = useState('');
   const [nameDelivery, setNameDelivery] = useState('');
   const [addressDelievry, setAddressDelivery] = useState('');

   const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_APIKEY || '',
      libraries: libraries,
   });
   const [map, setMap] = useState<any>( /** @type google.maps.Map */(null));
   const [directionResponse, setDirectionResponse] = useState(null);

   const directionCustomer = async () => {
      const directionService = new google.maps.DirectionsService();
      const result: any = await directionService.route({
         origin: { lat: Number.parseFloat(product.delivery.latitude), lng: Number.parseFloat(product.delivery.longitude) },
         destination: product.customer.addressShip,
         travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionResponse(result);
   }

   const getInfoFarmer = async (code: string) => {
      try {
         const responst = await apiGetInfoUser(code);
         setNameFarmer(responst.data.data.name);
         setAddressFarmer(responst.data.data.addressWallet);
      } catch (error: any) {
         console.log(error)
      }
   }

   const getInfoTPT = async (code: string) => {
      try {
         const responst = await apiGetInfoUser(code);
         setNameTPT(responst.data.data.name);
         setAddressTPT(responst.data.data.addressWallet);
      } catch (error: any) {
         console.log(error)
      }
   }

   const getInfoDelivery = async (code: string) => {
      try {
         const responst = await apiGetInfoUser(code);
         setNameDelivery(responst.data.data.name);
         setAddressDelivery(responst.data.data.addressWallet);
      } catch (error: any) {
         console.log(error)
      }
   }

   useEffect(() => {
      if (product) {
         getInfoFarmer(product.farmer.farmerCode);
         getInfoTPT(product.thirdParty.thirdPartyCode);
         getInfoDelivery(product.delivery.deliveryHubCode);
      }
   }, [])

   if (!isLoaded) {
      return <Loading />
   }

   return (
      <div className='bg-half-transparent nav-item w-screen fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
         <div className='bg-white w-[1200px] h-[650px] relative group rounded-md p-3 flex flex-col gap-3'>
            <button className='absolute top-2 right-2 text-444' onClick={() => setIsOpenModal(false)}>
               <IoCloseCircleOutline size={24} />
            </button>
            <h3 className='text-green font-medium uppercase text-xl border-b-1 border-color pb-1 w-[50%]'>Theo dõi đơn hàng</h3>
            <div className='flex gap-2 w-full h-full'>
               <div className='bg-gray-100 w-1/4 flex'>
                  <div className='relative'>
                     <span className='absolute right-[-14px] top-8 z-10 text-green'><IoMdCheckmarkCircleOutline size={28} className='z-10' /></span>
                     <div className='flex flex-col gap-0.5 mt-2 px-2'>
                        <span className='text-333'>Người sản xuất</span>
                        <span className='text-333 text-[15px]'>{nameFarmer}</span>
                        <span className='text-333 text-sm'>({showShortAddress(addressFarmer, 5)})</span>
                     </div>
                     <div className='relative'>
                        <span className='absolute z-10 right-[-14px] top-8 text-green'><IoMdCheckmarkCircleOutline size={28} /></span>
                        <div className='flex flex-col gap-0.5 mt-20 px-2'>
                           <span className='text-333'>Người vận chuyển</span>
                           <span className='text-333 text-[15px]'>{nameDelivery}</span>
                           <span className='text-333 text-sm'>({showShortAddress(addressDelievry, 5)})</span>
                        </div>
                     </div>
                  </div>
                  <div className='w-[2px] h-[45%] bg-bg-green'></div>
                  <div className='relative'>
                     <span className='absolute z-10 left-[-14px] top-28 text-green'><IoMdCheckmarkCircleOutline size={28} /></span>
                     <div className='flex flex-col gap-0.5 mt-24 px-1 pl-4'>
                        <span className='text-333'>Người môi giới</span>
                        <span className='text-333 text-[15px]'>{nameTPT}</span>
                        <span className='text-333 text-sm'>({showShortAddress(addressTPT, 5)})</span>
                     </div>
                     <span className='absolute z-10 top-64 text-red-600 font-medium text-lg rounded-md px-2 py-1 left-[-60px]'>Chờ nhận hàng</span>
                  </div>
               </div>
               <div className='flex-auto h-full relative'>
                  <button onClick={() => map.panTo({
                     lat: Number.parseFloat(product?.thirdParty.latitude),
                     lng: Number.parseFloat(product?.thirdParty.longitude)
                  })} className='absolute z-10 bottom-[30px] left-2 text-green'><BsFillBackspaceReverseFill size={22} /></button>
                  <button onClick={directionCustomer} className='absolute z-10 bottom-[5px] left-2 text-white text-sm bg-bg-green font-medium rounded-md px-2 py-1'>Xem tuyến đường giao hàng</button>
                  <GoogleMap
                     center={{
                        lat: Number.parseFloat(product?.delivery.latitude),
                        lng: Number.parseFloat(product?.delivery.longitude)
                     }}
                     zoom={13}
                     mapContainerStyle={{ width: '100%', height: '100%' }}
                     onLoad={(map: any) => setMap(map)}
                  >
                     <MarkerF
                        position={{
                           lat: Number.parseFloat(product?.farmer.latitude),
                           lng: Number.parseFloat(product?.farmer.longitude)
                        }}
                        icon={{
                           url: farmer_img,
                           scaledSize: new google.maps.Size(60, 110),
                        }}
                     >
                        <InfoBox options={options} >
                           <div style={{ backgroundColor: 'green', color: 'white', borderRadius: '4px', fontSize: '14px', padding: '4px 2px', textAlign: 'center' }}> Nơi sản xuất </div>
                        </InfoBox>
                     </MarkerF>
                     <MarkerF
                        position={{
                           lat: Number.parseFloat(product?.thirdParty.latitude),
                           lng: Number.parseFloat(product?.thirdParty.longitude)
                        }}
                        icon={{
                           url: broker_img,
                           scaledSize: new window.google.maps.Size(40, 80),
                        }}
                     >
                        <InfoBox options={options} >
                           <div style={{ backgroundColor: 'green', color: 'white', borderRadius: '4px', fontSize: '13px', padding: '2px 3px', textAlign: 'center' }}> Người môi giới </div>
                        </InfoBox>
                     </MarkerF>
                     <MarkerF
                        position={{
                           lat: Number.parseFloat(product?.delivery.latitude),
                           lng: Number.parseFloat(product?.delivery.longitude)
                        }}
                        icon={{
                           url: delivery_img,
                           scaledSize: new google.maps.Size(50, 90),
                        }}
                     >
                        <InfoBox options={options} >
                           <div style={{ backgroundColor: 'green', color: 'white', borderRadius: '4px', fontSize: '13px', padding: '2px 2px', textAlign: 'center' }}>Người vận chuyển</div>
                        </InfoBox>
                     </MarkerF>
                     <PolylineF path={[
                        {
                           lat: Number.parseFloat(product?.farmer.latitude),
                           lng: Number.parseFloat(product?.farmer.longitude)
                        },
                        {
                           lat: Number.parseFloat(product?.thirdParty.latitude),
                           lng: Number.parseFloat(product?.thirdParty.longitude)
                        },
                        {
                           lat: Number.parseFloat(product?.delivery.latitude),
                           lng: Number.parseFloat(product?.delivery.longitude)
                        }
                     ]} options={optionsPolyline} />
                     {directionResponse && <DirectionsRenderer directions={directionResponse} />}
                  </GoogleMap>
               </div>
            </div>
         </div>
      </div>
   )
}

const PurchaseForm = () => {

   const { currentUser } = useSelector((state: any) => state.user);

   const [web3Provider, setWeb3Provider] = useState<any>();
   const [address, setAddress] = useState('');
   const [activeTab, setActiveTab] = useState("wait-confirm");
   const [productsWaitConfirm, setProductsWaitConfirm] = useState<any>([]);
   const [productsShipByTPT, setProductsShipByTPT] = useState<any>([]);
   const [productsWarehouseDH, setProductsWarehouseDH] = useState<any>([]);
   const [productsShipByDH, setProductsShipByDH] = useState<any>([]);
   const [productPurchased, setProductPurchased] = useState<any>([]);
   const [isLoading, setIsLoadng] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false);

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

   const getProductsWaitConfirm = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.PurchasedByCustomer && data.customerDetails.customerCode === currentUser?.code));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsWaitConfirm(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProductsShipByTPT = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ShippedByThirdParty && data.customerDetails.customerCode === currentUser?.code));
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
            data.customerDetails.customerCode === currentUser?.code));
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
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ShippedByDeliveryHub && data.customerDetails.customerCode === currentUser?.code));
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
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ReceivedByCustomer && data.customerDetails.customerCode === currentUser?.code));
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
         code: data.productDetails.code,
         farmer: data.farmerDetails,
         thirdParty: data.thirdPartyDetails,
         delivery: data.deliveryHubDetails,
         customer: data.customerDetails,
         from: showShortAddress(data.thirdPartyDetails.thirdParty, 5),
         to: data.customerDetails.addressShip,
         totalPrice: formatToEth(data.customerDetails.feeShip) + formatToEth(data.productDetails.priceThirdParty),
         priceTPT: formatToEth(data.productDetails.priceThirdParty),
         priceDelivery: formatToEth(data.customerDetails.feeShip),
         images: data.productDetails.images,
         quantity: data.productDetails.quantity.toNumber(),
         date: data.productDetails.date.toNumber()
      }
   }

   useEffect(() => {
      if (currentUser?.code) {
         getProductsWaitConfirm();
         getProductsShipByTPT();
         getProductsWarehouseDH();
         getProductsShipByDeliveryHub();
         getProductsPurchased();
      }
   }, [currentUser?.code]);

   const handleConfirm = async (uid: number, TPTCode: string, deliveryCode: string, priceTPT: number, priceDelivery: number) => {
      const revenueTPT = priceTPT - 0.1 * priceTPT;
      const revenueDelivery = priceDelivery - 0.1 * priceDelivery;
      const revenueAdmin = 0.1 * priceTPT + 0.1 * priceDelivery;
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      try {
         setIsLoadng(true);
         const supplychainContract = new SupplyChainContract(web3Provider);
         listenEvent();
         await supplychainContract.receiveByCustomer(uid);
         const currentDate = new Date();
         await apiCreateStatistical({ code: TPTCode, revenue: revenueTPT, spend: 0, dateOfWeek: currentDate });
         await apiCreateStatistical({ code: deliveryCode, revenue: revenueDelivery, spend: 0, dateOfWeek: currentDate });
         await apiCreateStatistical({ code: process.env.REACT_APP_CODE_ADMIN, revenue: revenueAdmin, spend: 0, dateOfWeek: currentDate });
      } catch (error) {
         setIsLoadng(false)
         console.log(error);
      }
   }

   const listenEvent = () => {
      let contract = new ethers.Contract(SUPPLYCHAIN_ADDRESS, getAbiSupplyChain(), web3Provider);
      contract.once("ReceivedByCustomer", (uid) => {
         setIsLoadng(false);
         getProductsShipByDeliveryHub();
         getProductsPurchased();
      })
   }

   const actionPayload = {
      field: 'action',
      headerName: 'Thao tác',
      width: 150,
      renderCell: (params: any) => (
         <div className='flex gap-2 items-center'>
            <button onClick={() => handleViewMap(params.row)} className='text-white bg-bg-green px-2 py-1 rounded-md'>Xem</button>
            <button onClick={() => handleConfirm(params.row.uid, params.row.thirdParty.thirdPartyCode, params.row.delivery.deliveryHubCode, params.row.priceTPT, params.row.priceDelivery)} className='text-white bg-bg-green px-1 py-1 rounded-md'>Nhận hàng</button>
         </div>
      )
   }

   const actionEvaluate = {
      field: 'action',
      headerName: 'Thao tác',
      width: 110,
      renderCell: (params: any) => (
         <button className='text-white bg-bg-green px-3 py-1 rounded-md'>Đánh giá</button>
      )
   }

   const productRef = useRef();

   const handleViewMap = (product: any) => {
      productRef.current = product;
      setIsOpenModal(true);
   }

   const data = [
      {
         label: `Chờ xác nhận (${productsWaitConfirm.length})`,
         value: "wait-confirm",
         desc: productsWaitConfirm.length > 0 ?
            <DataTable columns={columnDelveryHub} rows={productsWaitConfirm} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: `Giao cho đơn vị vận chuyển (${productsShipByTPT.length})`,
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
            (<>
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
         {isOpenModal && <ModalViewProduct product={productRef.current} setIsOpenModal={setIsOpenModal} />}
         <Header />
         <div className='w-5/6 my-10'>
            <Tabs value={activeTab}>
               <TabsHeader
                  className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                  indicatorProps={{ className: "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none" }}>
                  {data.map(({ label, value }) => (
                     <Tab key={value} value={value} onClick={() => setActiveTab(value)} className={activeTab === value ? "text-[#EF4D2D] text-[15px] border-b-2 border-[#EF4D2D]" : "text-[15px]"}>
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

export default PurchaseForm;

const columnDelveryHub = [
   {
      field: 'uid',
      headerName: 'ID',
      width: 20
   },
   {
      field: 'code',
      headerName: 'Mã sản phẩm',
      width: 150,
   },
   {
      field: 'name',
      headerName: 'Tên',
      width: 90,
   },
   {
      field: 'images',
      headerName: 'Hình ảnh',
      width: 140,
      renderCell: (params: any) => (
         <img className='rounded-full w-24 h-20 object-cover' src={params.row.images} alt="" />
      )
   },
   {
      field: 'quantity',
      headerName: 'Số lượng',
      width: 80,
      renderCell: (params: any) => (
         <span>{params.row.quantity} Kg</span>
      )
   },
   {
      field: 'totalPrice',
      headerName: 'Tổng tiền',
      width: 120,
      renderCell: (params: any) => (
         <span className='font-medium'>{params.row.totalPrice} AGT</span>
      )
   },
   {
      field: 'from',
      headerName: 'Người gửi',
      width: 130,
   },
   {
      field: 'to',
      headerName: 'Địa chỉ nhận hàng',
      width: 320,
      renderCell: (params: any) => (
         <span>{params.row.to}</span>
      )
   },
]