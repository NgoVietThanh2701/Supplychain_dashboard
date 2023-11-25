
const ModalSaleToken = ({ setIsOpenModal }: any) => {

   return (
      <div className='bg-half-transparent fixed nav-item top-0 bottom-0 right-0 left-0 flex items-center justify-center'>
         <div className=' bg-white w-[400px] h-[200[x]'>
            <div>
               <h3 className='text-333 font-bold text-3xl'>Mua token</h3>
               <button type='button' onClick={() => setIsOpenModal(true)}></button>
            </div>
         </div>
      </div>
   )
}

export default ModalSaleToken