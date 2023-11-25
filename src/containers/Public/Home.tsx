import React from 'react'
import Header from '../../components/Public/Header';
import Banner from '../../components/Public/Banner';
import About from '../../components/Public/About';
import Footer from '../../components/Public/Footer';

const Home = () => {
   return (
      <div className='font-rubik w-full flex flex-col items-center'>
         <Header />
         <Banner />
         <About />
         <div className='w-full border-t-1 border-color' />
         <Footer />
      </div>
   )
}

export default Home