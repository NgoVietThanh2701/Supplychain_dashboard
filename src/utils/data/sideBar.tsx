import { FiShoppingBag, FiEdit } from 'react-icons/fi';
import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { IoMdContacts } from 'react-icons/io';
import { AiOutlineCalendar } from 'react-icons/ai';
import { BsKanban } from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';
import path from './path'

export const sideBarAdmin = [
   {
      title: 'Tổng quan',
      links: [
         {
            name: 'Thống kê',
            icon: <FiShoppingBag />,
            path: '/dashboard/statistical'
         }
      ]
   },
   {
      title: 'User',
      links: [
         {
            name: 'Yêu cầu đăng ký',
            icon: <AiOutlineShoppingCart />,
            path: path.ADMIN_REQUEST
         },
         {
            name: 'Người dùng',
            icon: <RiContactsLine />,
            path: path.ADMIN_USERS
         },
      ],
   },
]

export const sideBarFarmer = [
   {
      title: 'Tổng quan',
      links: [
         {
            name: 'Thống kê',
            icon: <FiShoppingBag />,
            path: path.FARMER_STATISTICAL
         }
      ]
   },
   {
      title: 'Sản phẩm',
      links: [
         {
            name: 'Sản phẩm',
            icon: <AiOutlineShoppingCart />,
            path: path.FARMER_PRODUCT
         },
         {
            name: 'Đơn hàng',
            icon: <RiContactsLine />,
            path: path.FARMER_ORDER
         },
         {
            name: 'Danh mục',
            icon: <RiContactsLine />,
            path: path.FARMER_CATEGORY
         },
      ],
   },
]