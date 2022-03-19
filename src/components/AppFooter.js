import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
       
        <span className="ms-1">&copy; 2021 genetous.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="http://www.genetous.com" target="_blank" rel="noopener noreferrer">
          Genetous
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
