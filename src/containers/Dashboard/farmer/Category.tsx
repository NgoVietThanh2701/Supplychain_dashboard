import React, { useState, useEffect } from 'react'
import DataTable from '../../../components/Dashboard/DataTable';
import { apideleteCategory, apigetCategories } from '../../../services/farmerServices';
import AddCategory from '../../../components/Dashboard/farmer/AddCategory';
import { useStateContext } from '../../../contexts/ContextProvider';

const nodata_img = require('../../../utils/images/no-data.jpg');

const Category = () => {

   const { currentColor } = useStateContext();

   const [categories, setCategories] = useState([]);
   const [isOpenModal, setIsOpenModal] = useState(false);

   const getCategories = async () => {
      try {
         const response = await apigetCategories();
         setCategories(response.data.data);
      } catch (error: any) {
         console.log(error.data)
      }
   }

   const deleteCatefory = async (code: string) => {
      try {
         await apideleteCategory(code);
         getCategories();
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      getCategories();
   }, []);

   const columns = [
      {
         field: 'code',
         headerName: 'ID',
         width: 300,
      },
      {
         field: 'name',
         headerName: 'Tên',
         width: 200
      },
      {
         field: 'createdAt',
         headerName: 'Ngày tạo',
         width: 240
      },
      {
         field: 'action',
         headerName: 'Thao tác',
         width: '180',
         renderCell: (params: any) => (
            <div>
               <button className='text-white rounded-md px-3 py-1' style={{ backgroundColor: currentColor }}>
                  Sửa
               </button>
               <button onClick={() => deleteCatefory(params.row.code)} className='bg-bg-red text-white rounded-md px-3 py-1 ml-2'>
                  Xóa
               </button>
            </div>
         )
      }
   ]

   return (
      <div className='w-auto bg-white mx-5 px-5 py-5 mt-14 rounded-lg h-[550px]'>
         {isOpenModal && <AddCategory setIsOpenModal={setIsOpenModal} getCategories={getCategories} />}
         <div className='flex items-center justify-between'>
            <h3 className='text-444 text-xl font-medium mb-5'>Danh sách loại sản phẩm</h3>
            <button onClick={() => setIsOpenModal(true)} className='text-white py-[7px] text-sm px-[10px] rounded-lg'
               style={{ backgroundColor: currentColor }}>Thêm danh mục</button>
         </div>
         {categories.length > 0 ? <DataTable columns={columns} rows={categories} height={65} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} />
               Không có dữ liệu nào!
            </div>}
      </div>
   )
}

export default Category

