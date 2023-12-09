import React, { useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import InputForm from '../../Public/InputForm'
import validate from '../../../utils/function/validateField';
import { apiaddCategory } from '../../../services/farmerServices';

const AddCategory = ({ setIsOpenModal, getCategories }: any) => {

   const [invalidFields, setInvalidFields] = useState<any>([]);
   const [payload, setPayload] = useState({
      name: ''
   });

   const handleAddCategory = async () => {
      let invalids = validate(payload, setInvalidFields);
      if (invalids === 0) {
         try {
            await apiaddCategory(payload.name);
            getCategories();
            setIsOpenModal(false);
         } catch (error) {
            console.log(error);
            setIsOpenModal(false);
         }
      }
   }

   return (
      <div className='bg-half-transparent nav-item w-screen fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
         <div className='bg-white w-[400px] relative group rounded-md p-5 flex flex-col gap-5 mb-48'>
            <button className='absolute top-2 right-2 text-444' onClick={() => setIsOpenModal(false)}>
               <IoCloseCircleOutline size={24} />
            </button>
            <h3 className='text-333 font-medium text-xl'>Thêm sản phẩm</h3>
            <InputForm
               setInvalidFields={setInvalidFields}
               invalidFields={invalidFields}
               label='Nhập tên danh mục'
               value={payload.name}
               setValue={setPayload}
               keyPayload='name'
            />
            <button onClick={handleAddCategory} className='text-white bg-bg-green px-3 py-1 mx-auto rounded-md'>
               Thêm
            </button>
         </div>
      </div>
   )
}

export default AddCategory