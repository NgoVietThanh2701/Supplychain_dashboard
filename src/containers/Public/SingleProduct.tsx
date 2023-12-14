import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BackgroundShop from '../../components/Public/BackgroundShop';
import Footer from '../../components/Public/Footer';
import DesProduct from '../../components/Public/DesProduct';
import SupplyChainContract from '../../contracts/SupplyChainContract';
import StateProduct from '../../utils/data/statesProduct';
import { formatToEth } from '../../utils/function/format';
import Swal from 'sweetalert2';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';

declare var window: any;

const SingleProduct = () => {

   const { code } = useParams();
   const { currentUser } = useSelector((state: any) => state.user);

   const [product, setProduct] = useState<any>();
   const [web3Provider, setWeb3Provider] = useState<any>();
   const [address, setAddress] = useState('');

   const getProducts = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         if (code) {
            const response = await supplychainContract.getProductByCode(code.toString());
            setProduct(convertObjectProduct(response));
         } else {
            Swal.fire('Opps!', 'Sản phẩm không tồn tại', 'error');
         }
      } catch (error) {
         console.log(error);
      }
   }

   useEffect(() => {
      getProducts();
   }, []);

   const convertObjectProduct = (data: any) => {
      return {
         uid: data.uid.toNumber(),
         productState: data.productState,
         name: data.productDetails.name,
         code: data.productDetails.code,
         thirdParty: data.thirdPartyDetails,
         farmer: data.farmerDetails,
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

   return (
      <div className='font-rubik w-full flex flex-col items-center'>
         <BackgroundShop />
         <DesProduct product={product} onConnectMetamask={onConnectMetamask} address={address} web3Provider={web3Provider} />
         <div className='w-full border-t-1 border-color mt-10' />
         <Footer />
      </div>
   )
}

export default SingleProduct