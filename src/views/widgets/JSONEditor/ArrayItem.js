import React, { useState } from 'react'
import StringItem from './StringItem';
import NumericItem from './NumericItem';
import BooleanItem from './BooleanItem';
import JSONObjectItem from './JSONObjectItem';

export default function ArrayItem(props) {

    const [isExpanded, setExpanded] = useState(false);
    const toggleExpand = () => setExpanded(!isExpanded);

    const updateJSONDataText = (e) => {
        props.updateJSONDataArray(props.field,[
            ...props.items.slice(0,Number(e.target.name)),
            e.target.value,
            ...props.items.slice(Number(e.target.name) + 1)
        ]);
    }

    const updateJSONDataNum = (name,numeric) => {
        props.updateJSONDataArray(props.field,[
            ...props.items.slice(0,Number(name)),
            numeric,
            ...props.items.slice(Number(name) + 1)
        ])
    }

    const updateJSONDataCheck = (e) => {
        props.updateJSONDataArray(props.field,[
            ...props.items.slice(0,Number(e.target.name)),
            !props.items[Number(e.target.name)],
            ...props.items.slice(Number(e.target.name) + 1)
        ]);
    }
    
    const updateJSONDataArray = (key,items) => {
        props.updateJSONDataArray(props.field,[
            ...props.items.slice(0,Number(key)),
            items,
            ...props.items.slice(Number(key) + 1)
        ]);
    }

    const renderByType = (value, index) => {
        if (typeof (value) === "string") {
            return (
                <StringItem
                field={index}
                text={value}
                onChange={updateJSONDataText}
                />
            )
        } else if (typeof (value) === "number") {
            return (
                <NumericItem
                    field={index}
                    text={value}
                    onChange={updateJSONDataNum}
                />
            )
        } else if (typeof (value) === "boolean") {
            return (
                <div>
                    <BooleanItem
                        field={index}
                        isTrue={value}
                        onChange={updateJSONDataCheck}
                    />
                </div>
            )
        } else if (typeof (value) === "object") {
            if (value.length === undefined) {
                return (
                    <div>
                        -
                    </div>
                )
            } else {
                return (
                    <div>
                        <ArrayItem
                            field={index}
                            items={value}
                            primary={!props.primary}
                            updateJSONDataArray={updateJSONDataArray}
                        />
                    </div>
                )
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
        <div className={props.primary ? "je-array-primary" : "je-array-secondary"}>
            <div className="json-editor-array-header">
                <label>
                    {props.field}
                </label>
                <button className="btn btn-success" onClick={toggleExpand}>
                    {
                        isExpanded ? "-" : "+"
                    }
                </button>
            </div>
            <div className={"json-editor-array-body " + (!isExpanded && "json-editor-passive")}>
                <ul>
                    {
                        props.items.map(renderByType)
                    }
                </ul>
            </div>
        </div>
    )
}
