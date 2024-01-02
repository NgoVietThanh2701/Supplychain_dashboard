import { FiShoppingBag } from 'react-icons/fi';
import { RiContactsLine } from 'react-icons/ri';
import { FaShopify } from "react-icons/fa";
import { PiShoppingCartThin } from "react-icons/pi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { PiGitPullRequest } from "react-icons/pi";
import { BiCategory } from "react-icons/bi";

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
            icon: <PiGitPullRequest size={22} />,
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
            icon: <PiShoppingCartThin />,
            path: path.FARMER_PRODUCT
         },
         {
            name: 'Đơn hàng',
            icon: <HiOutlineShoppingBag />,
            path: path.FARMER_ORDER
         },
         {
            name: 'Danh mục',
            icon: <BiCategory />,
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
            icon: <FaShopify />,
            path: path.THIRDPARTY_SHOP
         },
         {
            name: 'Đơn đặt hàng',
            icon: <PiShoppingCartThin />,
            path: path.THIRDPARTY_ORDERED
         },
         {
            name: 'Đơn mua',
            icon: <HiOutlineShoppingBag />,
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
            icon: <HiOutlineShoppingBag />,
            path: path.DELIVERYHUB_RECEIVE
         },
      ],
   },
]