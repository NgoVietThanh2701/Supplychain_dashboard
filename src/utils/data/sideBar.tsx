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
            path: path.ADMIN_STATISTICAL
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

export const sideBarThirdParty = [
   {
      title: 'Tổng quan',
      links: [
         {
            name: 'Thống kê',
            icon: <FiShoppingBag />,
            path: path.THIRDPARTY_STATISTICAL
         }
      ]
   },
   {
      title: 'Sản phẩm',
      links: [
         {
            name: 'Shop',
            icon: <AiOutlineShoppingCart />,
            path: path.THIRDPARTY_SHOP
         },
         {
            name: 'Đơn đặt hàng',
            icon: <AiOutlineShoppingCart />,
            path: path.THIRDPARTY_ORDERED
         },
         {
            name: 'Đơn mua',
            icon: <AiOutlineShoppingCart />,
            path: path.THIRDPARTY_PURCHASE_ORDER
         },
      ],
   },
]

export const sideBarDeliveryHub = [
   {
      title: 'Tổng quan',
      links: [
         {
            name: 'Thống kê',
            icon: <FiShoppingBag />,
            path: path.DELIVERYHUB_STATISTICAL
         }
      ]
   },
   {
      title: 'Đơn hàng',
      links: [
         {
            name: 'Đơn hàng',
            icon: <AiOutlineShoppingCart />,
            path: path.DELIVERYHUB_RECEIVE
         },
      ],
   },
]