import { FiShoppingBag, FiEdit } from 'react-icons/fi';
import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { IoMdContacts } from 'react-icons/io';
import { AiOutlineCalendar } from 'react-icons/ai';
import { BsKanban } from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';

const sideBar = [
   {
      title: 'Dashboard',
      links: [
         {
            name: 'Statistical',
            icon: <FiShoppingBag />,
            path: '/dashboard/statistical'
         }
      ]
   },
   {
      title: 'User',
      links: [
         {
            name: 'customer',
            icon: <AiOutlineShoppingCart />,
            path: '/zz'
         },
         {
            name: 'employees',
            icon: <IoMdContacts />,
            path: '/emply'
         },
         {
            name: 'customers',
            icon: <RiContactsLine />,
            path: '/cus'
         },
      ],
   },


]

export default sideBar