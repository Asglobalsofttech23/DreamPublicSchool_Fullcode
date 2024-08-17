// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined
} from '@ant-design/icons';

import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';

// icons
const icons = {
  SchoolIcon,
  GroupIcon,
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined

};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const admindomains = {
  id: 'Entries',
  title: 'Student Domains',
  type: 'group',
  children: [
    // {
    //   id: 'student-index',
    //   title: 'Students',
    //   type: 'item',
    //   url: '/allStudents',
    //   icon: icons.SchoolIcon
    // },

    {
      id: 'student-index',
      title: 'New Admission',
      type: 'item',
      url: '/newAdmission',
      icon: icons.SchoolIcon
    },
   
    {
      id: 'students-index',
      title: 'Booking',
      type: 'item',
      url: '/StudentsBooking',
      icon: icons.SchoolIcon
    },
    // {
    //   id: 'staff-index',
    //   title: 'Admission',
    //   type: 'item',
    //   url: '/allstaffs',
    //   icon: icons.GroupIcon,

    // },

     {
      id: 'studentss-index',
      title: 'Student list',
      type: 'item',
      url: '/allstudentlist',
      icon: icons.GroupIcon,

    },
    {
      id: 'studentssS-index',
      title: 'Student Allocation',
      type: 'item',
      url: '/allocation',
      icon: icons.GroupIcon,

    },
    {
      id: 'classs-index',
      title: 'Classes',
      type: 'item',
      url: '/allclass',
      icon: icons.GroupIcon,

    },   
    {
      id: 'classsnew-index',
      title: 'New academic Allocate',
      type: 'item',
      url: '/classAllocation',
      icon: icons.GroupIcon,

    },
  ]
};

// const teacherdomain={
//   id: 'Entries',
//   title: 'Fields',
//   type: 'group',
//   children: [
   
//     // {
//     //   id: 'class-students',
//     //   title: 'class-Students',
//     //   type: 'item',
//     //   url: '/classstudents',
//     //   icon: icons.SchoolIcon
//     // },
//     {
//       id: 'class-students',
//       title: 'Teacher',
//       type: 'item',
//       url: '/classstudents',
//       icon: icons.SchoolIcon
//     },
//     {
//       id: 'Attendance',
//       title: 'Attendance',
//       type: 'item',
//       url: '/attendance',
//       icon: icons.SchoolIcon
//     },
//     {
//       id: 'Mark allocation',
//       title: 'Mark allocation',
//       type: 'item',
//       url: '/exams',
//       icon: icons.SchoolIcon
//     },
//     {
//       id: 'Profile',
//       title: 'Profile',
//       type: 'item',
//       url: '/profile',
//       icon: icons.SchoolIcon
//     },
//     {
//       id: 'TimeTable',
//       title: 'TimeTable',
//       type: 'item',
//       url: '/timetable',
//       icon: icons.SchoolIcon
//     },
    
   
   
    
//   ]
// }
const domains = sessionStorage.getItem("admin") ? admindomains :
sessionStorage.getItem("super") ? admindomains :''
// sessionStorage.getItem("employeeLoggedIn") ? teacherdomain :''
export default domains;
