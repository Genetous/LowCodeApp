import React, { useState } from 'react'
import {
    CForm,
    CFormCheck
} from '@coreui/react'
export default function BooleanItem(props) {
    return (
        <CForm>
            <CFormCheck id="flexCheckDefault" name={props.field} checked={props.isTrue} onChange={props.onChange} label={props.field} />
        </CForm>
    )
}
