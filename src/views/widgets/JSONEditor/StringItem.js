import React, { useState } from 'react'
import {
    CForm,
    CFormLabel,
    CFormInput,
} from '@coreui/react'
export default function StringItem(props) {
    return (
        <CForm>
            <CFormLabel style={{color:"#fff"}} htmlFor="collectionName">{props.field}</CFormLabel>
            <CFormInput type="text" id="collectionName" value={props.text} onChange={props.onChange} name={props.field} />
        </CForm>

    )
}
