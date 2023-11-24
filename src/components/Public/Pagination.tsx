import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import Product from './Product';

const itemStyle = 'flex items-center justify-center px-[10px] h-8 border-1 border-gray-300 bg-white hover:bg-gray-100 rounded-sm text-333'

const Pagination = ({ itemsPerPage, data }: any) => {

   const [itemOffset, setItemOffset] = useState(0);
   const endOffset = itemOffset + itemsPerPage;
   const currentItems = data.slice(itemOffset, endOffset);
   const pageCount = Math.ceil(data.length / itemsPerPage);

   const handlePageClick = (event: any) => {
      const newOffset = (event.selected * itemsPerPage) % data.length;
      setItemOffset(newOffset);
   };

   return (
      <>
         <Product dataProduct={currentItems} />
         <ReactPaginate
            previousLabel='Previous'
            nextLabel='Next'
            breakLabel='...'
            pageCount={pageCount}
            pageRangeDisplayed={8}
            onPageChange={handlePageClick}
            containerClassName='flex items-center justify-center'
            pageClassName='rounded-sm'
            pageLinkClassName={itemStyle}
            previousClassName={`${itemStyle} `}
            nextLinkClassName={itemStyle}
            activeLinkClassName={`${itemStyle} text-blue-700 bg-[#EBF5FF]`}
            renderOnZeroPageCount={null}
         />
      </>
   )
}

export default Pagination