import React,{useState} from 'react'
import {
    CForm,
    CFormLabel,
    CFormInput,
} from '@coreui/react'
export default function NumericItem(props) {
    const [secureText, setSecureText] = useState(props.text)

    const onChangeHandler = (e) => {
        setSecureText(e.target.value);
    }

    const checkInput = (e) => {
        const number = Number(e.target.value);
        if(isNaN(number)){
            setSecureText(props.text);
        }else{
            props.onChange(e.target.name,number)
        }
    }
    
    return (
        <CForm>
        <CFormLabel style={{color:"#fff"}} htmlFor="collectionName">{props.field}</CFormLabel>
        <CFormInput type="text" id="collectionName" value={secureText}
                name={props.field}
                onChange={onChangeHandler}
                onBlur={checkInput} />
    </CForm>
       
    )
}
