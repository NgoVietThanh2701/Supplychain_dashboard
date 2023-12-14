import Slider from "react-slick";
import { dataBanner } from '../../utils/data/home';

const Card = ({ data }: any) => {
   return (
      <div className='flex w-full bg-background-slide bg-cover h-[666px] pt-20'>
         <div className='w-2/5 flex flex-col gap-6 ml-32 pt-20'>
            <h3 className='leading-[1.15] text-333 text-6xl font-bold'>{data.title}</h3>
            <p className='leading-7 text-333 pr-14'>{data.description}</p>
            <button className='text-white mx-auto bg-bg-green rounded-3xl text-lg py-3 px-6 mt-3'>What you do</button>
         </div>
         <div className='flex-auto'>
            <img src={data.image} alt="banner" className='w-full h-full object-cover' />
         </div>
      </div>
   )
}

const Banner = () => {

   const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      speed: 1000,
      autoplaySpeed: 3000,
      slidesToScroll: 1,
      autoplay: true,
      arrows: false,
      appendDots: (dots: any) => (
         <div
            style={{
               position: "absolute",
               bottom: "10px",
               left: "50%",
               transform: "translateX(-50%)",
            }}
         >
            <ul style={{ margin: "0", padding: "0" }}>{dots}</ul>
         </div>
      )
   }

   return (
      <div className='flex-1 w-full'>
         <Slider {...settings}>
            {dataBanner.map((data: any) => (
               <Card data={data} key={data.id} />
            ))}
         </Slider>
      </div>
   )
}

export default Banner