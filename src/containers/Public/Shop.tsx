import React from 'react'
import BackgroundShop from '../../components/Public/BackgroundShop'
import Footer from '../../components/Public/Footer'
import Pagination from '../../components/Public/Pagination'

const img = require('../../utils/images/product1.png')

const dataProduct = [
   {
      title: 'cá tươi ngon',
      image: img
   },
   {
      title: 'cá tươi ngon',
      image: img
   },
   {
      title: 'cá tươi ngon',
      image: img
   },
   {
      title: 'cá tươi ngon',
      image: img
   },
   {
      title: 'cá tươi ngon',
      image: img
   },
   {
      title: 'cá tươi ngon',
      image: img
   },
   {
      title: 'cá tươi ngon',
      image: img
   },
   {
      title: 'cá tươi ngon',
      image: img
   },
   {
      title: 'cá tươi ngon',
      image: img
   },
   {
      title: 'cá tươi ngon',
      image: img
   },
]

const Shop = () => {
   return (
      <div className='font-rubik w-full flex flex-col items-center'>
         <BackgroundShop />
         <Pagination itemsPerPage={8} data={dataProduct} />
         <div className='w-full border-t-1 border-color mt-10' />
         <Footer />
      </div>
   )
}

export default Shop