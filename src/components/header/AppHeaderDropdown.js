import React,{ useState }from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CButton
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import { withRouter, Redirect,useHistory } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const [redirect, setRedirect] = useState(false);
  const history = useHistory()
  const logout = async () => {
      localStorage.removeItem('token');
      history.push("/")
  }
 
  return (
    <CButton color="link" onClick={logout}>Logout</CButton>
  )
}

export default AppHeaderDropdown
