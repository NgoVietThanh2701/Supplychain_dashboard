import { formatTime } from "../function/format";

export const column1 = [
   {
      field: 'uid',
      headerName: 'ID',
      width: 40
   },
   {
      field: 'code',
      headerName: 'Mã sản phẩm',
      width: 140,
   },
   {
      field: 'name',
      headerName: 'Tên',
      width: 100,
   },
   {
      field: 'images',
      headerName: 'Hình ảnh',
      renderCell: (params: any) => (
         <img className='rounded-full w-20' src={params.row.images} alt="" />
      )
   },
   {
      field: 'price',
      headerName: 'Giá (AGT)',
      width: 100
   },
   {
      field: 'category',
      headerName: 'Loại',
      width: 100
   },
   {
      field: 'description',
      headerName: 'Mô tả',
      width: 100
   },
   {
      field: 'quantity',
      headerName: 'Số lượng (Kg)',
      width: 100
   },
   {
      field: 'temp',
      headerName: 'Nhiệt độ (C)',
      width: 100
   },
   {
      field: 'humidity',
      headerName: 'Độ ẩm (%)',
      width: 80
   },
   {
      field: 'date',
      headerName: 'Ngày sản xuất',
      width: 100,
      renderCell: (params: any) => (
         <span>
            {formatTime(params.row.date * 1000)}
         </span>
      )
   },
]

export const column2 = [
   {
      field: 'uid',
      headerName: 'ID',
      width: 20
   },
   {
      field: 'code',
      headerName: 'Mã sản phẩm',
      width: 100,
   },
   {
      field: 'name',
      headerName: 'Tên',
      width: 100,
   },
   {
      field: 'images',
      headerName: 'Hình ảnh',
      renderCell: (params: any) => (
         <img className='rounded-full w-20' src={params.row.images} alt="" />
      )
   },
   {
      field: 'price',
      headerName: 'Giá gốc',
      width: 90
   },
   {
      field: 'priceTPT',
      headerName: 'Giá bán',
      width: 90
   },
   {
      field: 'category',
      headerName: 'Loại',
      width: 80
   },
   {
      field: 'description',
      headerName: 'Mô tả',
      width: 80
   },
   {
      field: 'quantity',
      headerName: 'Số lượng (Kg)',
      width: 100
   },
   {
      field: 'temp',
      headerName: 'Nhiệt độ (C)',
      width: 100
   },
   {
      field: 'humidity',
      headerName: 'Độ ẩm (%)',
      width: 80
   },
   {
      field: 'date',
      headerName: 'Ngày sản xuất',
      width: 115,
      renderCell: (params: any) => (
         <span>
            {formatTime(params.row.date * 1000)}
         </span>
      )
   },
]

export const column3 = [
   {
      field: 'uid',
      headerName: 'ID',
      width: 20
   },
   {
      field: 'code',
      headerName: 'Mã',
      width: 80,
   },
   {
      field: 'name',
      headerName: 'Tên',
      width: 90,
   },
   {
      field: 'images',
      headerName: 'Hình ảnh',
      renderCell: (params: any) => (
         <img className='rounded-full w-20' src={params.row.images} alt="" />
      )
   },
   {
      field: 'price',
      headerName: 'Giá gốc',
      width: 80
   },
   {
      field: 'priceTPT',
      headerName: 'Giá bán ra',
      width: 95
   },
   {
      field: 'category',
      headerName: 'Loại',
      width: 100
   },
   {
      field: 'description',
      headerName: 'Mô tả',
      width: 80
   },
   {
      field: 'quantity',
      headerName: 'Số lượng (Kg)',
      width: 85
   },
   {
      field: 'feeShip',
      headerName: 'Phí ship',
      width: 75
   },
   {
      field: 'temp',
      headerName: 'Nhiệt độ (C)',
      width: 80
   },
   {
      field: 'humidity',
      headerName: 'Độ ẩm %',
      width: 70
   },
   {
      field: 'date',
      headerName: 'Ngày sản xuất',
      width: 100,
      renderCell: (params: any) => (
         <span>
            {formatTime(params.row.date * 1000)}
         </span>
      )
   },
]

export const columnDelveryHub = [
   {
      field: 'uid',
      headerName: 'ID',
      width: 20
   },
   {
      field: 'code',
      headerName: 'Mã sản phẩm',
      width: 150,
   },
   {
      field: 'name',
      headerName: 'Tên',
      width: 90,
   },
   {
      field: 'images',
      headerName: 'Hình ảnh',
      renderCell: (params: any) => (
         <img className='rounded-full w-20' src={params.row.images} alt="" />
      )
   },
   {
      field: 'priceTPT',
      headerName: 'Giá (AGT)',
      width: 100
   },
   {
      field: 'quantity',
      headerName: 'Số lượng (Kg)',
      width: 100
   },
   {
      field: 'feeShip',
      headerName: 'Phí ship (AGT)',
      width: 110
   },
   {
      field: 'from',
      headerName: 'Người gửi',
      width: 130,
   },
   {
      field: 'to',
      headerName: 'Người nhận',
      width: 130,
      renderCell: (params: any) => (
         <span>{params.row.to}</span>
      )
   },
]
