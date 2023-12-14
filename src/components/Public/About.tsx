import React, { useState } from 'react'
import Slider from 'react-slick';
import { dataAbout } from '../../utils/data/home';
import { GrLinkNext } from "react-icons/gr";
import { IoMdArrowBack } from "react-icons/io";

const about_slc = require('../../utils/images/about_slc.jpg');

const Card = ({ data }: any) => {
   return (
      <div className='mx-2 pb-5 border-item-product'>
         <div className='w-full h-60'>
            <img src={data.image} alt="" className='w-full h-full object-cover p-2' />
         </div>
         <div className='text-green text-base flex items-center gap-2 mx-5 my-3'><div className='w-2 h-2 rounded-full bg-bg-green'></div>{data.title}</div>
         <p className='text-333 text-base mx-5 font-bold'>{data.description}</p>
      </div>
   )
}

const About = () => {

   const [isButtonHidden, setIsButtonHidden] = useState(true);

   const handleMouseEnter = () => {
      setIsButtonHidden(false);
   };

   const handleMouseLeave = () => {
      setIsButtonHidden(true);
   };

   const settings = {
      dots: false,
      infinite: true,
      slidesToShow: 2,
      speed: 500,
      autoplaySpeed: 2000,
      slidesToScroll: 1,
      autoplay: true,
      nextArrow: <SampleNextArrow isHidden={isButtonHidden} />,
      prevArrow: <SamplePreArrow isHidden={isButtonHidden} />
   }

   return (
      <div className='w-full bg-[#F4FAF4] px-28 flex gap-8 mt-[100px] py-20'>
         <div className='w-1/2'>
            <p className='text-green '>VỀ CHÚNG TÔI</p>
            <h3 className='text-333 text-4xl leading-tight font-bold mt-3'>Cung cấp những sản phẩm uy tín chất lượng.</h3>
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='mt-20'>
               <Slider {...settings}>
                  {dataAbout.map((data: any) => (
                     <Card key={data.id} data={data} />
                  ))}
               </Slider>
            </div>
         </div>
         <div className='flex-auto text-red'>
            <p className='text-[#7A7E9A] leading-7 border-l-1 border-color pl-3 ml-20 text-justify'>AgriChain là một nền tảng phần mềm tập hợp tất cả các bên liên quan trong chuỗi cung ứng nông nghiệp, cho phép họ đưa ra quyết định sáng suốt hơn, loại bỏ các thủ tục giấy tờ và sổ ghi chép không cần thiết, giảm thiểu rủi ro và hiệu quả của chuỗi cung ứng, mở cửa thị trường và tăng lợi nhuận, tất cả chỉ trong một - nền tảng để sử dụng..</p>
            <div className='w-full mt-10'>
               <img src={about_slc} className='w-full h-full object-cover' alt="" />
            </div>
         </div>
      </div>
   )
}

const SampleNextArrow = (props: any) => (
   <button onClick={props.onClick}
      style={{
         zIndex: '10',
         color: 'white',
         padding: '10px',
         borderRadius: '100%',
         display: props.isHidden ? 'none' : 'block',
         backgroundColor: '#209E2E',
         position: "absolute",
         bottom: '55%',
         right: 0,
         transform: "translateX(30%)"
      }}>
      <GrLinkNext />
   </button>
)

const SamplePreArrow = (props: any) => (
   <button onClick={props.onClick}
      style={{
         zIndex: '10',
         color: 'white',
         padding: '10px',
         borderRadius: '100%',
         display: props.isHidden ? 'none' : 'block',
         backgroundColor: '#209E2E',
         position: "absolute",
         bottom: "55%",
         left: 0,
         transform: "translateX(-30%)",
      }}>
      <IoMdArrowBack />
   </button>
)

export default About