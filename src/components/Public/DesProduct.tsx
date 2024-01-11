import { useState } from 'react';
import { FaStar } from "react-icons/fa";
import { CiChat1 } from "react-icons/ci";
import { CiShop } from "react-icons/ci";
import Swal from 'sweetalert2';
import SupplyChainContract from '../../contracts/SupplyChainContract';
import { useNavigate } from 'react-router-dom';
import path from '../../utils/data/path';
import Loading from '../Loading';
import AGTContract from '../../contracts/AGTContract';
import { IoCloseCircleOutline } from 'react-icons/io5'
import { formatTime } from '../../utils/function/format';
import { useJsApiLoader, LoadScriptProps, GoogleMap, MarkerF, PolylineF, InfoBox } from '@react-google-maps/api';
import AutoCompleteMap from '../AutoCompleteMap';
import { MdAlignHorizontalCenter } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { FaAmazonPay } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { SUPPLYCHAIN_ADDRESS, getAbiSupplyChain } from '../../contracts/config';

//declare var window: any;
const libraries: LoadScriptProps['libraries'] = ['places'];
const no_img = require('../../utils/images/avatar.png')
const farmer_img = require('../../utils/images/farmer.png');
const broker_img = require('../../utils/images/broker.png');
const inputStyle = {
   boxShadow: 'inset 0 0 10px #eee !important',
   border: '2px solid #eee',
   width: '456px',
   height: '40px',
   marginLeft: '16px',
   borderRadius: '20px',
   fontWeight: '300 !important',
   outline: 'none',
   padding: '10px 20px',
   marginBottom: '10px',
}
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

const OrderedModal = ({ setIsOpenModal, web3Provider, uid, name, priceTPT, quantity, distance, location, image }: any) => {

   const [isLoading, setIsLoading] = useState(false);
   const { currentUser } = useSelector((state: any) => state.user);
   const navigate = useNavigate();
   const feeShip = Math.round(distance * quantity / 1500);

   const handleBuyProduct = async () => { //open modal type address for customer
      try {
         setIsLoading(true);
         const supplychainContract = new SupplyChainContract(web3Provider);
         const agtContract = new AGTContract(web3Provider);
         listenEvent();
         await agtContract.approve(supplychainContract._contractAddress, priceTPT + feeShip);
         await supplychainContract.purchaseByCustomer(uid, feeShip, location, currentUser?.code);
      } catch (error) {
         setIsLoading(false);
         setIsOpenModal(false);
         console.log(error)
      }
   }

   const listenEvent = () => {
      let contract = new ethers.Contract(SUPPLYCHAIN_ADDRESS, getAbiSupplyChain(), web3Provider);
      contract.once("PurchasedByCustomer", (uid) => {
         setIsLoading(false);
         setIsOpenModal(false);
         Swal.fire('Success', 'Đặt hàng thành công, Theo dõi đơn hàng hồ sơ của bạn', 'success');
         navigate(path.PURCHARSE_FORM);
      })
   }

   return (
      <div className='bg-half-transparent nav-item w-screen fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
         <div className='bg-white w-[728px] relative group rounded-md py-5 px-6 flex flex-col gap-3 mb-16 text-333'>
            {isLoading && <Loading />}
            <button className='absolute top-2 right-2 text-444' onClick={() => setIsOpenModal(false)}>
               <IoCloseCircleOutline size={24} />
            </button>
            <h3 className='text-green font-medium uppercase text-xl border-b-1 border-color pb-1 w-[50%]'>Thanh toán đơn hàng</h3>
            <div className='flex text-[#EF4D2D] gap-1'>
               <CiLocationOn size={24} />
               <span> Địa Chỉ Nhận Hàng</span>
            </div>
            <div className='flex bg gap-2'>
               <div className='w-[350px] text-333 text-[15px] border-r-1 border-color pr-3'>
                  <span className='line-clamp-1 uppercase font-medium'>{currentUser?.name}</span>
                  <span className='line-clamp-1'>{currentUser?.email}</span>
               </div>
               <div className='flex-auto text-444'>
                  <span className='line-clamp-3 text-[15px]'>{location} [{distance > 1000 ? `${distance / 1000} km` : `${distance} m`}]</span>
               </div>
            </div>
            <h4 className='text-333 font-medium  border-b-1 border-color pb-1 w-[26%]'>Thông tin sản phẩm</h4>
            <div className='flex items-center'>
               <div className='w-24 h-14'>
                  <img src={image} alt="" className='w-full h-full object-cover' />
               </div>
               <span className='line-clamp-1 min-w-[200px] px-5 text-sm' >{name} </span>
               <span className='text-444 w-[100px] text-sm'>{priceTPT} AGT</span>
               <span className='text-444 w-[100px] text-sm'>{quantity} Kg</span>
            </div>
            <div className='flex text-[#EF4D2D] gap-2 items-center'>
               <FaAmazonPay size={24} />
               <span>Thanh toán</span>
            </div>
            <div className='flex '>
               <div className='flex-1'>
                  <span className='text-333'>Phương thức thanh toán</span>
                  <div className='flex items-center gap-2 mt-2'>
                     <img src="https://docs.material-tailwind.com/icons/metamask.svg" alt="metamask" className="h-5 w-5" />
                     <span className='text-[15px] text-333'> Ví Metamask</span>
                  </div>
               </div>
               <div className='flex-auto flex flex-col items-end gap-1 text-[15px] text-666'>
                  <div className='flex items-center'>
                     <span className='w-32'>Tổng tiền hàng</span>
                     <span className='w-32'>{priceTPT} AGT</span>
                  </div>
                  <div className='flex items-center'>
                     <span className='w-32'>Phí vận chuyển</span>
                     <span className='w-32'>{feeShip} AGT</span>
                  </div>
                  <div className='flex items-center border-t border-color pt-1'>
                     <span className='w-32'>Tổng thanh toán</span>
                     <span className='w-36 text-[#EF4D2D] font-medium text-xl'>{feeShip + priceTPT} AGT</span>
                  </div>
               </div>
            </div>
            <div className='flex gap-2 items-center mt-1 mb-1'>
               <label className='text-666 text-sm w-[400px]' htmlFor="terms">Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản của chúng tôi.</label>
               <button onClick={handleBuyProduct} className='text-white bg-bg-green py-1 px-6 rounded-md mx-auto'>Đặt hàng</button>
            </div>
         </div>
      </div>
   )
}

const DesProduct = ({ product, onConnectMetamask, address, web3Provider }: any) => {

   const [map, setMap] = useState<any>( /** @type google.maps.Map */(null));
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [distance, setDistance] = useState(0);
   const [payload, setPayload] = useState({
      location: '',
   });

   const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_APIKEY || '',
      libraries: libraries,
   });

   if (!isLoaded) {
      return <Loading />
   }

   const handleOpenModal = async (thirdParty: any) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      if (!payload.location) {
         Swal.fire('Opps', 'Vui lòng nhập địa chỉ nhận hàng', 'error');
         return;
      }
      await caculatorFeeShip(thirdParty);
      setIsOpenModal(true);
   }

   const caculatorFeeShip = async (thirdParty: any) => {
      if (!payload.location) {
         Swal.fire('Opps', 'Vui lòng nhập địa chỉ nhận hàng', 'error');
      }
      const directionService = new google.maps.DirectionsService();
      const result: any = await directionService.route({
         origin: { lat: Number.parseFloat(thirdParty.latitude), lng: Number.parseFloat(thirdParty.longitude) },
         destination: payload.location,
         travelMode: google.maps.TravelMode.DRIVING
      });
      const _distance: number = Number.parseFloat(result.routes[0].legs[0].distance.value);
      setDistance(_distance);
   }

   return (
      <>
         {product ?
            <div className='w-5/6 mt-20'>
               {isOpenModal && <OrderedModal setIsOpenModal={setIsOpenModal} web3Provider={web3Provider} uid={product?.uid} name={product?.name} priceTPT={product?.priceTPT} quantity={product?.quantity} distance={distance} location={payload.location} image={product?.images} />}
               <div className='flex gap-7'>
                  <div className='w-2/5 h-[450px] border-1 border-color bg-background-slide'>
                     <img src={product?.images} className='w-full h-full object-cover' alt="" />
                  </div>
                  <div className='w-3/5 flex flex-col pt-1 gap-4'>
                     <p className='text-333 leading-7 text-xl line-clamp-3'>[{product?.description}]</p>
                     <h3 className='text-3xl font-bold text-333'>{product?.name}</h3>
                     <p className='text-444 font-medium text-xl'>Giá:  {product?.priceTPT} AGT</p>
                     <p className='text-444 font-medium text-xl'>{`Khối lượng: ${product?.quantity} Kg`}</p>
                     <div className='flex gap-[3px] items-center'>
                        {Array.from({ length: 5 }, (value: any, index: any) => (
                           <FaStar key={index} size={16} color='#f4a708' />
                        ))}
                        <span className='text-666 underline ml-1'>3 review</span>
                     </div>
                     <AutoCompleteMap setPayload={setPayload} label='Nhập địa chỉ nhận hàng' />
                     <button onClick={() => handleOpenModal(product?.thirdParty)}
                        className={`px-3 py-[5.5px] bg-bg-green rounded-md text-white ml-1 mx-auto ${(!address || !payload.location) && 'cursor-not-allowed opacity-60'}`} >Mua ngay</button>
                     <div>
                        {address ? <p className='text-green'>Kết nối ví thành công!</p> :
                           <button className='text-[#C82032] text-base block'
                              onClick={onConnectMetamask}>Vui lòng kết nối ví</button>
                        }
                     </div>
                  </div>
               </div>
               <div className='mt-10 flex bg-[#F5F5F5] py-3 px-5 gap-5 rounded-md'>
                  <div className='w-16 h-16'>
                     <img src={no_img} className='w-full h-full object-cover rounded-full' alt="" />
                  </div>
                  <div className='flex flex-col justify-around'>
                     <h3 className='text-333'>Người bán: {product?.thirdParty[0]}</h3>
                     <div className='flex items-center gap-3'>
                        <button className='inline-flex items-center gap-1 text-333 border border-green-300 px-2 py-1 rounded-md text-sm'><CiChat1 />Chat ngay </button>
                        <button className='inline-flex items-center gap-1 text-333 border border-green-300 px-2 py-1 rounded-md text-sm'><CiShop />Xem shop </button>
                     </div>
                  </div>
               </div>
               <div className='flex mt-5 gap-1'>
                  <div className='w-2/5 flex flex-col gap-4 pr-5'>
                     <h3 className='text-333 text-xl'>CHI TIẾT SẢN PHẨM</h3>
                     <div className='flex mt-3'>
                        <span className='w-44'>Loại</span>
                        <span>{product?.category}</span>
                     </div>
                     <div className='flex'>
                        <span className='w-44'>Số lượng</span>
                        <span>{product?.quantity}</span>
                     </div>
                     <div className='flex'>
                        <span className='w-44'>Nhiệt độ </span>
                        <span>{product?.temp} độ C</span>
                     </div>
                     <div className='flex'>
                        <span className='w-44'>Độ ẩm</span>
                        <span>{product?.humidity} %</span>
                     </div>
                     <div className='flex items-center'>
                        <span className='w-44'>Ngày sản xuất</span>
                        <p>{formatTime(product?.date * 1000)}</p>
                     </div>
                     <div className='flex items-center'>
                        <span className='w-48'>Bảo quản</span>
                        <p className='w-auto'>Nơi khô ráo, tránh ánh nắng trực tiếp từ mặt trời...</p>
                     </div>
                  </div>
                  <div className='w-3/5 h-[400px] relative'>
                     <button onClick={() => map.panTo({
                        lat: Number.parseFloat(product?.farmer.latitude),
                        lng: Number.parseFloat(product?.farmer.longitude)
                     })} className='absolute top-[50%] left-3 z-10 text-333'><MdAlignHorizontalCenter size={26} /></button>
                     <GoogleMap
                        center={{
                           lat: Number.parseFloat(product?.farmer.latitude),
                           lng: Number.parseFloat(product?.farmer.longitude)
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
                              <div style={{ backgroundColor: 'green', color: 'white', borderRadius: '4px', fontSize: '13px', padding: '2px 3px', textAlign: 'center' }}> Third Party </div>
                           </InfoBox>
                        </MarkerF>
                        <MarkerF
                           position={{
                              lat: Number.parseFloat(product?.farmer.latitude),
                              lng: Number.parseFloat(product?.farmer.longitude)
                           }}
                           icon={{
                              url: farmer_img,
                              scaledSize: new window.google.maps.Size(60, 110),
                           }}
                        >
                           <InfoBox options={options} >
                              <div style={{ backgroundColor: 'green', color: 'white', borderRadius: '4px', fontSize: '14px', padding: '4px 2px', textAlign: 'center' }}> Nơi sản xuất </div>
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
                           }]}
                           options={optionsPolyline} />
                     </GoogleMap>
                  </div>
               </div>
            </div> : <Loading />}
      </>
   )
}

export default DesProduct