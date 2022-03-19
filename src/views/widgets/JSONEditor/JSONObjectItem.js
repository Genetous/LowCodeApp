import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import StringItem from './StringItem';
import NumericItem from './NumericItem';
import BooleanItem from './BooleanItem';
import ArrayItem from './ArrayItem';

const JSONObjectItem = forwardRef((props,ref) => {

    /*state*/
    const [isExpanded, setExpanded] = useState(false)
    const toggleExpand = () => setExpanded(!isExpanded);

    const [JSONData,setJSONData] = useState(props.objectData);

    useEffect(()=>{
        setJSONData(props.objectData)
    },[props.objectData])
    
    useImperativeHandle(ref,()=>({
        getJSONData() {
            return JSONData;
        }
    }))

    const updateJSONDataText = (e) => {
        setJSONData({
            ...JSONData,
            [e.target.name] : e.target.value
        });
    }

    const updateJSONDataNum = (name,numeric) => {
        setJSONData({
            ...JSONData,
            [name] : numeric
        })
    }

    const updateJSONDataCheck = (e) => {
        setJSONData({
            ...JSONData,
            [e.target.name]:!JSONData[e.target.name]
        })
    }
    
    const updateJSONDataArray = (key,items) => {
        setJSONData({
            ...JSONData,
            [key] : items
        })
    }
    
    /*dom func*/

    /*comp func*/
    const renderByType = (key, index) => {
        if (typeof (JSONData[key]) === "string") {
            return (
                <StringItem
                    field={key}
                    text={JSONData[key]}
                    onChange={updateJSONDataText}
                />
            )
        } else if (typeof (JSONData[key]) === "number") {
            return (
                <NumericItem
                    field={key}
                    text={JSONData[key]}
                    onChange={updateJSONDataNum}
                />
            )
        } else if (typeof (JSONData[key]) === "boolean") {
            return (
                <div>
                    <BooleanItem 
                        field={key}
                        isTrue={JSONData[key]}
                        onChange={updateJSONDataCheck}
                    />
                </div>
            )
        } else if (typeof (JSONData[key]) === "object") {
            if (JSONData[key].length !== undefined) {
                return (
                    <div>
                        <ArrayItem
                            items={JSONData[key]}
                            field={key}
                            primary={!props.primary}
                            updateJSONDataArray={updateJSONDataArray}
                        />
                    </div>
                )
            }else{
                return(<div>-</div>)
            }
        } else {
            return (
                <div>
                    undefined
                </div>
            )
        }
    }

    return (
        <div className={props.primary ? "je-primary" : "je-secondary"}>
            <div className="json-editor-header">
                <label style={{color:"#fff"}} className='me-2'>
                    {props.field}
                </label>
                <button className="btn btn-dark" onClick={() => toggleExpand()}>
                    {
                        isExpanded ? "Collapse" : "Expand"
                    }
                </button>
            </div>
            <div className={"json-editor-body " + (!isExpanded && "json-editor-passive")}>
                {
                    Object.keys(JSONData).map(renderByType)
                }
            </div>
        </div>
    )
})

export default JSONObjectItem;