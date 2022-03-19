import React, {useRef, useState} from 'react'
import JSONObjectItem from './JSONObjectItem'
import { verify, login, Methods, post } from '../../../api'
import Popup from '../Popup';
import { ToastContainer, toast } from 'react-toastify';

export default function JSONEditor(props) {

    const childRef = useRef();
    
    const [modal,setModal] = useState(false);

    const toggleModal = () => {
        if(modal){
            setActiveModalState({});
        }
        setModal(!modal)
    }

    const [activeModalState,setActiveModalState] = useState({});

    const updateJSONOnClickHandler = async () => {
        const childJSON = await childRef.current.getJSONData();
        const mainJSON = await props.data;
        const id = await props.name;
        const model = {
            id,
            fields:[]
        }
        const childKeys = Object.keys(childJSON);
        for(let i = 0; i < childKeys.length; i++){
            if(typeof(childJSON[childKeys[i]]) === "object"){
                if(childJSON[childKeys[i]].length !== undefined){
                    let isUpdated = false;
                    for(let j = 0 ; j < childJSON[childKeys[i]].length; j++){
                        if(childJSON[childKeys[i]][j] !== mainJSON[childKeys[i]][j]){
                            isUpdated = true;
                            break;
                        }
                    }
                    if(isUpdated){
                        model.fields.push({field:childKeys[i],value:childJSON[childKeys[i]]});
                    }
                }
            }else{
                if(childJSON[childKeys[i]] !== mainJSON[childKeys[i]]){
                    model.fields.push({field:childKeys[i],value:childJSON[childKeys[i]]});
                }
            }
        }
        if(model.fields.length === 0){
           
        }else{
            setActiveModalState(model);
            setModal(!modal);
        }
    }

    if(props.data){
        return(
            <div>
                <ToastContainer />
                <button className="btn btn-success" onClick={updateJSONOnClickHandler}>
                    Güncelle
                </button>
                <JSONObjectItem
                    objectData={props.data}
                    isRoot={true}
                    field={props.name}
                    primary={true}/*Thats for only css and object hierarchy*/
                    ref={childRef}
                />
                
            </div>
        )
    }else{
        return(
            <div>
                Loading..
            </div>
        )
    }
}
