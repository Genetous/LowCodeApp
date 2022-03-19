import React from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
import {
  cilAvTimer,
  cilBell,
  cilCalculator,
  cilChart,
  cilChartPie,
  cilCursor,
  cilDrop,
  cilFile,
  cilFork,
  cilLibrary,
  cilLibraryAdd,
  cilLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavGroup,
    name: 'File Operations',
    to: '/',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Upload',
        to: '/upload',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'FileList',
        to: '/getlist',
        icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
      }
    ]
  },

  {
    component: CNavGroup,
    to: '/collection',
    name: 'Collections',
    icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Collection',
        to: '/collection/add',
        icon: <CIcon icon={cilLibraryAdd} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Delete Collection',
        to: '/collection/delete',
        icon: <CIcon icon={icon.cilTrash} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Update Collection',
        to: '/collection/update',
        icon: <CIcon icon={icon.cilRecycle} customClassName="nav-icon" />,
      }
    ]
  },
  {
    component: CNavGroup,
    to: '/relation',
    name: 'Relations',
    icon: <CIcon icon={cilLink} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Relation',
        to: '/relation/add',
        icon: <CIcon icon={icon.cilLibraryAdd} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Delete Relation',
        to: '/relation/delete',
        icon: <CIcon icon={icon.cilTrash} customClassName="nav-icon" />,
      },
    ]
  },
  {
    component: CNavGroup,
    to: '/notification',
    name: 'Notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Email Notification',
        to: '/notification/email',
        icon: <CIcon icon={icon.cilEnvelopeClosed} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Mobile Notification',
        to: '/notification/mobile',
        icon: <CIcon icon={icon.cilMobile} customClassName="nav-icon" />,
      }
    ]
  },
  {
    component: CNavGroup,
    to: '/jobs',
    name: 'Jobs',
    icon: <CIcon icon={cilAvTimer} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'DB Job',
        to: '/jobs/db',
        icon: <CIcon icon={icon.cilVector} customClassName="nav-icon" />,
      },
      /* {
        component: CNavItem,
        name: 'DB Job With E-mail Result',
        to: '/jobs/dbmail',
        icon: <CIcon icon={icon.cilAt} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'DB Job With Notification Result',
        to: '/jobs/dbnotification',
        icon: <CIcon icon={icon.cilMobile} customClassName="nav-icon" />,
      } */
    ]
  },
  {
    component: CNavGroup,
    to: '/analytics',
    name: 'Analytics',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Create Analytics',
        to: '/analytics/analytic',
        icon: <CIcon icon={icon.cilChartLine} customClassName="nav-icon" />,
      }
    ]
  },
  {
    component: CNavGroup,
    to: '/recommendation',
    name: 'Recommendation',
    icon: <CIcon icon={cilFork} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Relate New Nodes',
        to: '/recommendation/relate_new_nodes',
        icon: <CIcon icon={icon.cilShareAlt} customClassName="nav-icon" />,
      }, 
      {
        component: CNavItem,
        name: 'Create New Nodes',
        to: '/recommendation/create_new_nodes',
        icon: <CIcon icon={icon.cilLibraryAdd} customClassName="nav-icon" />,
      }, 
      {
        component: CNavItem,
        name: 'Delete Nodes',
        to: '/recommendation/delete_nodes',
        icon: <CIcon icon={icon.cilTrash} customClassName="nav-icon" />,
      }, 
      {
        component: CNavItem,
        name: 'Delete Relationship',
        to: '/recommendation/delete_relationship',
        icon: <CIcon icon={icon.cilCut} customClassName="nav-icon" />,
      }, 
      {
        component: CNavItem,
        name: 'Depth Recommendation',
        to: '/recommendation/depth',
        icon: <CIcon icon={icon.cilGraph} customClassName="nav-icon" />,
      }, 
      {
        component: CNavItem,
        name: 'Shortest Path',
        to: '/recommendation/shortest',
        icon: <CIcon icon={icon.cilWalk} customClassName="nav-icon" />,
      }
    ]
  },
  {
    component: CNavGroup,
    to: '/query',
    name: 'Query',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Query Builder',
        to: '/query/builder',
        icon: <CIcon icon={icon.cilChartLine} customClassName="nav-icon" />,
      }
    ]
  },
  /* ,
  {
    component: CNavTitle,
    name: 'Theme',
  },
  {
    component: CNavItem,
    name: 'Colors',
    to: '/theme/colors',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Typography',
    to: '/theme/typography',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavGroup,
    name: 'Base',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Accordion',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'Breadcrumb',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Cards',
        to: '/base/cards',
      },
      {
        component: CNavItem,
        name: 'Carousel',
        to: '/base/carousels',
      },
      {
        component: CNavItem,
        name: 'Collapse',
        to: '/base/collapses',
      },
      {
        component: CNavItem,
        name: 'List group',
        to: '/base/list-groups',
      },
      {
        component: CNavItem,
        name: 'Navs & Tabs',
        to: '/base/navs',
      },
      {
        component: CNavItem,
        name: 'Pagination',
        to: '/base/paginations',
      },
      {
        component: CNavItem,
        name: 'Placeholders',
        to: '/base/placeholders',
      },
      {
        component: CNavItem,
        name: 'Popovers',
        to: '/base/popovers',
      },
      {
        component: CNavItem,
        name: 'Progress',
        to: '/base/progress',
      },
      {
        component: CNavItem,
        name: 'Spinners',
        to: '/base/spinners',
      },
      {
        component: CNavItem,
        name: 'Tables',
        to: '/base/tables',
      },
      {
        component: CNavItem,
        name: 'Tooltips',
        to: '/base/tooltips',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Buttons',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Buttons',
        to: '/buttons/buttons',
      },
      {
        component: CNavItem,
        name: 'Buttons groups',
        to: '/buttons/button-groups',
      },
      {
        component: CNavItem,
        name: 'Dropdowns',
        to: '/buttons/dropdowns',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Forms',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Form Control',
        to: '/forms/form-control',
      },
      {
        component: CNavItem,
        name: 'Select',
        to: '/forms/select',
      },
      {
        component: CNavItem,
        name: 'Checks & Radios',
        to: '/forms/checks-radios',
      },
      {
        component: CNavItem,
        name: 'Range',
        to: '/forms/range',
      },
      {
        component: CNavItem,
        name: 'Input Group',
        to: '/forms/input-group',
      },
      {
        component: CNavItem,
        name: 'Floating Labels',
        to: '/forms/floating-labels',
      },
      {
        component: CNavItem,
        name: 'Layout',
        to: '/forms/layout',
      },
      {
        component: CNavItem,
        name: 'Validation',
        to: '/forms/validation',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Charts',
    to: '/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Icons',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'CoreUI Free',
        to: '/icons/coreui-icons',
        badge: {
          color: 'success',
          text: 'NEW',
        },
      },
      {
        component: CNavItem,
        name: 'CoreUI Flags',
        to: '/icons/flags',
      },
      {
        component: CNavItem,
        name: 'CoreUI Brands',
        to: '/icons/brands',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        component: CNavItem,
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        component: CNavItem,
        name: 'Modal',
        to: '/notifications/modals',
      },
      {
        component: CNavItem,
        name: 'Toasts',
        to: '/notifications/toasts',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Widgets',
    to: '/widgets',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  }, */
]

export default _nav
