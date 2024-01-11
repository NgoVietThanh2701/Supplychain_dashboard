import React, { useEffect, useRef, useState } from 'react'
import StateProduct from '../../../utils/data/statesProduct';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import { formatToEth, showShortAddress } from '../../../utils/function/format';
import Loading from '../../../components/Loading';
import DataTable from '../../../components/Dashboard/DataTable';
import { ethers } from 'ethers';
import { useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import { useSelector } from 'react-redux';
import { useJsApiLoader, GoogleMap, MarkerF, InfoBox, DirectionsRenderer, LoadScriptProps } from '@react-google-maps/api';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { BsFillBackspaceReverseFill } from "react-icons/bs";
import { useStateContext } from '../../../contexts/ContextProvider';
import { SUPPLYCHAIN_ADDRESS, getAbiSupplyChain } from '../../../contracts/config';

const libraries: LoadScriptProps['libraries'] = ['places'];

const nodata_img = require('../../../utils/images/no-data.jpg');
const broker_img = require('../../../utils/images/broker.png');
const options = { closeBoxURL: '', enableEventPropagation: true };

const ModalViewProduct = ({ setIsOpenModal, product }: any) => {

   const { currentColor } = useStateContext();

   const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_APIKEY || '',
      libraries: libraries,
   });
   const [map, setMap] = useState<any>( /** @type google.maps.Map */(null));
   const [directionResponse, setDirectionResponse] = useState(null);
   const [distance, setDistance] = useState('');
   const [duration, setDuration] = useState('')

   if (!isLoaded) {
      return <Loading />
   }

   const directionCustomer = async (product: any) => {
      const directionService = new google.maps.DirectionsService();
      const result: any = await directionService.route({
         origin: { lat: Number.parseFloat(product.thirdParty.latitude), lng: Number.parseFloat(product.thirdParty.longitude) },
         destination: product.customer.addressShip,
         travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionResponse(result);
      setDistance(result.routes[0].legs[0].distance.text);
      setDuration(result.routes[0].legs[0].duration.text);
   }

   return (
      <div className='bg-half-transparent nav-item w-screen fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
         <div className='bg-white w-[976px] h-[650px] relative group rounded-md p-3 flex flex-col gap-3'>
            <button className='absolute top-2 right-2 text-444' onClick={() => setIsOpenModal(false)}>
               <IoCloseCircleOutline size={24} />
            </button>
            <h3 className='text-green font-medium uppercase text-xl border-b-1 border-color pb-1 w-[50%]'>Xem chi tiết quãng đường vận chuyển</h3>
            <div className='w-full h-full relative'>
               <div className='w-[168px] h-[100px] absolute bottom-0 z-10 left-0 bg-white flex flex-col text-sm justify-between p-1'>
                  <div className='flex items-center justify-between'>
                     <button className='text-white  px-2 py-1 rounded-md' style={{ backgroundColor: currentColor }}
                        onClick={() => directionCustomer(product)}>Xem tuyến đường</button>
                     <button className='text-red-600' onClick={() => map.panTo({
                        lat: Number.parseFloat(product?.thirdParty.latitude),
                        lng: Number.parseFloat(product?.thirdParty.longitude)
                     })} ><BsFillBackspaceReverseFill size={20} /></button>
                  </div>
                  <span className='text-444'>Khoảng cách: {distance}</span>
                  <span className='text-444'>Mất khoảng: {duration}</span>
               </div>
               <GoogleMap
                  center={{
                     lat: Number.parseFloat(product?.thirdParty.latitude),
                     lng: Number.parseFloat(product?.thirdParty.longitude)
                  }}
                  zoom={14}
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  onLoad={(map: any) => setMap(map)}
               >
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
                        <div style={{ backgroundColor: 'green', color: 'white', borderRadius: '4px', fontSize: '13px', padding: '2px 3px', textAlign: 'center' }}> Nhận hàng tại đây </div>
                     </InfoBox>
                  </MarkerF>
                  {directionResponse && <DirectionsRenderer directions={directionResponse} />}
               </GoogleMap>
            </div>
         </div>
      </div>
   )
}

const ReceiveDH = () => {

   const { currentColor } = useStateContext();

   const web3Provider: ethers.providers.Web3Provider = useOutletContext();
   const { currentUser } = useSelector((state: any) => state.user);

   const [productsShipByTPT, setProductsShipByTPT] = useState<any>([]);
   const [productsReceived, setProductsReceived] = useState<any>([]);
   const [productsDeliveryed, setProductsDeliveryed] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [longitude, setLongitude] = useState('');
   const [latitude, setLatitude] = useState('');
   const [activeTab, setActiveTab] = useState("ordered");
   const [isOpenModal, setIsOpenModal] = useState(false);

   const productRef = useRef();

   const handleViewMap = async (product: any) => {
      if (!product) {
         return;
      }
      productRef.current = product;
      setIsOpenModal(true);
   }

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
            data.deliveryHubDetails.deliveryHubCode === currentUser?.code));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsReceived(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProductsDeliveryed = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ReceivedByCustomer &&
            data.deliveryHubDetails.deliveryHubCode === currentUser?.code));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsDeliveryed(listProducts.reverse());
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
         customer: data.customerDetails,
         from: showShortAddress(data.thirdPartyDetails.thirdParty, 5),
         to: data.customerDetails.addressShip,
         feeShip: formatToEth(data.customerDetails.feeShip),
         images: data.productDetails.images,
         quantity: data.productDetails.quantity.toNumber(),
         date: data.productDetails.date.toNumber()
      }
   }

   useEffect(() => {
      if (currentUser?.code) {
         getProductsShipByTPT();
         getProductsReceived();
         getProductsDeliveryed();
      }
   }, [currentUser?.code]);

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
         listenEventConfirm();
         await supplychainContract.receiveByDeliveryHub(uid, longitude, latitude, currentUser?.code);
      } catch (error) {
         setIsLoading(false);
         console.log(error);
      }
   }

   const listenEventConfirm = () => {
      let contract = new ethers.Contract(SUPPLYCHAIN_ADDRESS, getAbiSupplyChain(), web3Provider);
      contract.once("ReceivedByDeliveryHub", (uid) => {
         setIsLoading(false);
         getProductsShipByTPT();
         getProductsReceived();
      })
   }

   const handleShip = async (uid: number) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      try {
         setIsLoading(true);
         const supplychainContract = new SupplyChainContract(web3Provider);
         listenEventShip();
         await supplychainContract.shipByDeliveryHub(uid);
      } catch (error) {
         setIsLoading(false);
         console.log(error);
      }
   }

   const listenEventShip = () => {
      let contract = new ethers.Contract(SUPPLYCHAIN_ADDRESS, getAbiSupplyChain(), web3Provider);
      contract.once("ShippedByDeliveryHub", (uid) => {
         setIsLoading(false);
         getProductsReceived();
      })
   }

   const actionReceive = {
      field: 'action',
      headerName: 'Thao tác',
      width: 150,
      renderCell: (params: any) => (
         <div className='flex gap-2'>
            <button onClick={() => handleViewMap(params.row)} className='text-white rounded-md px-3 py-1 bg-bg-green'>
               Xem
            </button>
            <button onClick={() => handleConfirm(params.row.uid)} className='text-white rounded-md px-3 py-1' style={{ backgroundColor: currentColor }}>
               Nhận
            </button>
         </div>
      )
   }

   const actionShip = {
      field: 'action',
      headerName: 'Thao tác',
      width: 80,
      renderCell: (params: any) => (
         <button onClick={() => handleShip(params.row.uid)} className='text-white rounded-md px-6 py-1' style={{ backgroundColor: currentColor }}>
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
      {
         label: `Đơn hàng đã giao (${productsDeliveryed.length})`,
         value: "deliveryed",
         desc: productsDeliveryed.length > 0 ?
            <DataTable columns={columnDelveryHub} rows={productsDeliveryed} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
   ]

   return (
      <div className='w-auto bg-white mx-5 px-5 py-2 mt-8 rounded-lg'>
         {isLoading && <Loading />}
         {isOpenModal && <ModalViewProduct product={productRef.current} setIsOpenModal={setIsOpenModal} />}
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

export default ReceiveDH;

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
      width: 130,
      renderCell: (params: any) => (
         <img className='rounded-full w-32 h-24 object-cover' src={params.row.images} alt="" />
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
      field: 'feeShip',
      headerName: 'Phí ship',
      width: 90,
      renderCell: (params: any) => (
         <span>{params.row.feeShip} AGT</span>
      )
   },
   {
      field: 'from',
      headerName: 'Người gửi',
      width: 120,
   },
   {
      field: 'to',
      headerName: 'Địa chỉ',
      width: 260,
      renderCell: (params: any) => (
         <span>{params.row.to}</span>
      )
   },
]