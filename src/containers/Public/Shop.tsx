import React, { useEffect, useState } from 'react'
import BackgroundShop from '../../components/Public/BackgroundShop'
import Footer from '../../components/Public/Footer'
import Pagination from '../../components/Pagination'
import Product from '../../components/Public/Product'
import SupplyChainContract from '../../contracts/SupplyChainContract'
import StateProduct from '../../utils/data/statesProduct'
import { formatToEth } from '../../utils/function/format'

const Shop = () => {

   const [products, setProducts] = useState<any>([]);

   const getProducts = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => data.productState === StateProduct.SoldByThirdParty);
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProducts(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   useEffect(() => {
      getProducts();
   }, [])

   const convertObjectProduct = (data: any) => {
      return {
         uid: data.uid.toNumber(),
         productState: data.productState,
         name: data.productDetails.name,
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

   return (
      <div className='font-rubik w-full flex flex-col items-center'>
         <BackgroundShop />
         <Pagination itemsPerPage={8} data={products} Component={Product} />
         <div className='w-full border-t-1 border-color mt-10' />
         <Footer />
      </div>
   )
}

export default Shop