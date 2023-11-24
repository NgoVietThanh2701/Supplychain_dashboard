import React from 'react'
import Pagination from '../../components/Public/Pagination'
import Header from '../../components/Public/Header';
import Banner from '../../components/Public/Banner';
import About from '../../components/Public/About';
import Footer from '../../components/Public/Footer';

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const Home = () => {
   return (
      <div className='font-rubik w-full flex flex-col items-center'>
         <Header />
         <Banner />
         <About />
         <div className='w-full border-t-1 border-color' />
         <Footer />
         {/* <Pagination itemsPerPage={5} data={data} /> */}
      </div>
   )
}

export default Home