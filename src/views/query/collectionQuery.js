import React, { Component } from 'react';
import { verify, login, Methods, post } from '../../api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import Popup from '../widgets/Popup';
import JSONPretty from 'react-json-prettify';
import { Stepper } from 'react-form-stepper';
import { tomorrowNight as currentTheme } from 'react-json-prettify/dist/themes';
import {
    CAvatar,
    CButton,
    CCard,
    CCardBody,
    CCol,
    CRow,
    CListGroup,
    CListGroupItem,
    CForm,
    CFormLabel,
    CFormTextarea,
    CFormInput,
    CProgressBar,
    CProgress,
    CCardTitle,
    CDropdown,
    CDropdownItem,
    CDropdownToggle,
    CDropdownMenu,
    CFormCheck,
    CFormSelect,
    CCardHeader,
    CNav,
    CNavItem,
    CNavLink,
    CTabPane,
    CTabContent,
    CContainer
} from '@coreui/react'
export class CollectionQuery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collection: {
               
            },
            andFields: [],
            orFields: [],
            sizeFields: {
                from: 0,
                limit: 0
            },
            gt: {
                field: "",
                value: ""
            },
            lt: {
                field: "",
                value: ""
            },
            orderby: {
                field: "",
                type: ""
            },
            sizeVisible: false,
            gtVisible: false,
            ltVisible: false,
            orderbyVisible: false,
            collections: [],
            activeCollection: {},
            nodeCollectionInputs: [],
            method: "createNodes",
            react_method: "CreateNodes",
            reactString: "{}",
            MethodType: {},
            contentString: "",
            collectionString: "",
            reactString: "{}",
            activeKey: 1,
        }
    }
    componentDidMount(){
        this.getRelationNames()
    }
    async getRelationNames() {
        var onay = false
        var hata = ""
        var res = ""
        var method = Methods.GetCollections
        const model = {
            "distinct": "collectionName"
        }
        var col = null;
        await post(model, method).then(function (result) {
            onay = true
            col = result
        }, err => {
            try {
                hata = err.response.data
            } catch {
                hata = err.message
            }
        });
        if (onay) {
            await this.setState({
                collections: col.values
            });
            this.getCollectionContentRequest(col.values[0]);
        } else {
            console.log(hata);
        }

    }

    copyText(id) {
        var elm = document.getElementById(id);
        if (document.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(elm);
            range.select();
            document.execCommand("Copy");
        }
        else if (window.getSelection) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(elm);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand("Copy");
            selection.removeAllRanges();
        }
        toast.success("Copied", {
            position: "bottom-right",
            autoClose: 1200,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
    addAndFields() {
        const { andFields } = this.state;

        if (andFields.filter(ci => ci.field === "").length == 0) {
            this.setState({
                andFields: [...this.state.andFields, { field: "", value: "" }]
            })
        }
        this.setCode()
    }
    getAndFields(sibling, index) {
        return (
            <CRow className='collection-siblings mb-1 mt-1' key={index}>
                <CCol md={12}>
                    <CForm>
                        <CRow>
                            <CCol md={5}>
                                <CFormInput type="text" name="field" id={sibling.field} value={sibling.field} placeholder="Field" onChange={this.andFieldOnChangeHandler.bind(this, index)} />
                            </CCol>
                            <CCol md={5}>
                                <CFormInput type="text" name="value" id={sibling.value} value={sibling.value} placeholder="Value" onChange={this.andFieldOnChangeHandler.bind(this, index)} />
                            </CCol>

                            <CCol md={2} className='d-flex justify-content-between'>
                                <CButton onClick={this.removeAndField.bind(this, index)} color="danger"><CIcon icon={icon.cilTrash} size="l" /></CButton>

                            </CCol>
                        </CRow>
                    </CForm>
                </CCol>
            </CRow>

        )
    }
    removeAndField(index) {
        const { andFields } = this.state;
        const andFieldsCopy = [...andFields];
        andFieldsCopy.splice(index, 1);
        this.setState({
            andFields: andFieldsCopy
        })
        this.setCode()
    }
    andFieldOnChangeHandler(index, e) {
        const { andFields } = this.state;
        andFields[index][e.target.name] = e.target.value;
        this.setState({
            andFields
        });
        this.setCode()
    }

    addOrFields() {
        const { orFields } = this.state;

        if (orFields.filter(ci => ci.field === "").length == 0) {
            this.setState({
                orFields: [...this.state.orFields, { field: "", value: "" }]
            })
        }
        this.setCode()
    }
    getOrFields(sibling, index) {
        return (
            <CRow className='collection-siblings mb-1 mt-1' key={index}>
                <CCol md={12}>
                    <CForm>
                        <CRow>
                            <CCol md={5}>
                                <CFormInput type="text" name="field" id={sibling.field} value={sibling.field} placeholder="Field" onChange={this.orFieldOnChangeHandler.bind(this, index)} />
                            </CCol>
                            <CCol md={5}>
                                <CFormInput type="text" name="value" id={sibling.value} value={sibling.value} placeholder="Value" onChange={this.orFieldOnChangeHandler.bind(this, index)} />
                            </CCol>

                            <CCol md={2} className='d-flex justify-content-between'>
                                <CButton onClick={this.removeOrField.bind(this, index)} color="danger"><CIcon icon={icon.cilTrash} size="l" /></CButton>

                            </CCol>
                        </CRow>
                    </CForm>
                </CCol>
            </CRow>

        )
    }
    removeOrField(index) {
        const { orFields } = this.state;
        const orFieldsCopy = [...orFields];
        orFieldsCopy.splice(index, 1);
        this.setState({
            orFields: orFieldsCopy
        })
        this.setCode()
    }
    orFieldOnChangeHandler(index, e) {
        const { orFields } = this.state;
        orFields[index][e.target.name] = e.target.value;
        this.setState({
            orFields
        });
        this.setCode()
    }
    addSizeField(val) {
        this.setState({ sizeVisible: val })
        this.setCode()
    }

    sizeOnChangeHandler(e) {
        const { sizeFields } = this.state;
        sizeFields[e.target.name] = e.target.value;
        this.setState({
            sizeFields
        });
        this.setCode()
    }

    addLtField(val) {
        this.setState({ ltVisible: val })
        this.setCode()
    }

    ltOnChangeHandler(e) {
        const { lt } = this.state;
        lt[e.target.name] = e.target.value;
        this.setState({
            lt
        });
        this.setCode()
    }
    addGtField(val) {
        this.setState({ gtVisible: val })
        this.setCode()
    }

    gtOnChangeHandler(e) {
        const { gt } = this.state;
        gt[e.target.name] = e.target.value;
        this.setState({
            gt
        });
        this.setCode()
    }
    addOrderByField(val) {
        this.setState({ orderbyVisible: val })
        this.setCode()
    }
    orderbyOnChangeHandler(e) {
        const { orderby } = this.state;
        orderby[e.target.name] = e.target.value;
        this.setState({
            orderby
        });
        this.setCode()
    }
    collectionChanged(e){
        this.getCollectionContentRequest(e.target.value);
    }
    async getCollectionContentRequest(collection) {
        var onay = false
        var hata = ""
        var res = ""
        var col = {}
        const tName = "collectionName"
        var method = Methods.GetCollections
        var model = {}
        model[tName] = collection
        await post(model, method).then(function (result) {
            onay = true
            col = result.values[0]
        }, err => {
            try {
                hata = err.response.data
            } catch {
                hata = err.message
            }
        });
        this.setState({activeCollection:col})
    }
    async setCode() { 
        await this.setState({
            collection:{}
        })
        const { collection,sizeFields,gt,lt,sizeVisible,
            gtVisible,ltVisible,orderbyVisible,orderby,orFields,andFields } = this.state;
        
        /* gtVisible: false,
        ltVisible: false,
        orderbyVisible: false, */
        if (gtVisible) {
            collection["gt"] = {}
            collection["gt"][gt.field] = gt.value
        } else {
            if (gt.field != "" && gt.field in collection) {
                delete collection[gt.field]
            }
        }
        if (ltVisible) {
            collection["lt"] = {}
            collection["lt"][lt.field] = lt.value
        } else {
            if (lt.field != "" && lt.field in collection) {
                delete collection[lt.field]
            }
        }
        if(orderbyVisible){
            collection["orderby"]={}
            collection["orderby"]["field"]=orderby.field
            collection["orderby"]["type"]=orderby.type
        }else{
            if("orderby" in collection){
                delete collection["orderby"]
            }
        }
        if(orFields.length>0)
            collection["or"]=[]
        for(var i=0;i<orFields.length;++i){
            var val=orFields[i]
            var f=val.field
            var v=val.value
            var addVal={}
            addVal[f]=v
            collection["or"].push(addVal)
        }
        for(var i=0;i<andFields.length;++i){
            var val=andFields[i]
            var f=val.field
            var v=val.value
            collection[f]=v
        }
        await this.setState({
            collection
        })
        this.props.onUpdateCollection(this.state.collection)
    }
    prevStepKey(){
        this.props.prevStepKey()
    }
    render() {
        return (
            <CContainer>
                <CRow>
                    <CCol>
                        <CCard className="mb-4">
                            <CCardBody className='m-1'>
                                <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>And Fields</CCardHeader>
                                {
                                    this.state.andFields.map((item, ind) => (
                                        this.getAndFields(item, ind)
                                    ))
                                }
                                <CRow>
                                    <CCol md={12}>
                                        <CButton onClick={this.addAndFields.bind(this)} color="dark" className='mt-1 mb-1'><CIcon icon={icon.cilPlus} size="l" />Add And Fields</CButton>
                                    </CCol>
                                </CRow>
                                <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>Or Fields</CCardHeader>
                                {
                                    this.state.orFields.map((item, ind) => (
                                        this.getOrFields(item, ind)
                                    ))
                                }
                                <CRow>
                                    <CCol md={12}>
                                        <CButton onClick={this.addOrFields.bind(this)} color="dark" className='mt-1 mb-1'><CIcon icon={icon.cilPlus} size="l" />Add Or Fields</CButton>
                                    </CCol>
                                </CRow>
                                <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>Size/Limit</CCardHeader>
                                <CRow className={this.state.sizeVisible == true ? "" : "visually-hidden"}>
                                    <CCol md={12}>
                                        <CForm>
                                            <CRow>
                                                <CCol md={5}>
                                                    <CFormInput type="text" name="from" value={this.state.sizeFields.from} placeholder="From" onChange={this.sizeOnChangeHandler.bind(this)} />
                                                </CCol>
                                                <CCol md={5}>
                                                    <CFormInput type="text" name="limit" value={this.state.sizeFields.limit} placeholder="Limit" onChange={this.sizeOnChangeHandler.bind(this)} />
                                                </CCol>

                                                <CCol md={2} className='d-flex justify-content-between'>
                                                    <CButton onClick={this.addSizeField.bind(this, false)} color="danger"><CIcon icon={icon.cilTrash} size="l" /></CButton>

                                                </CCol>
                                            </CRow>

                                        </CForm>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol md={12}>
                                        <CButton onClick={this.addSizeField.bind(this, true)} color="dark" className='mt-1 mb-1'><CIcon icon={icon.cilPlus} size="l" />Add Size/Limit</CButton>
                                    </CCol>
                                </CRow>
                                <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>Less Than</CCardHeader>
                                <CRow className={this.state.ltVisible == true ? "" : "visually-hidden"}>
                                    <CCol md={12}>
                                        <CForm>
                                            <CRow>
                                                <CCol md={5}>
                                                    <CFormInput type="text" name="field" value={this.state.lt.field} placeholder="Field" onChange={this.ltOnChangeHandler.bind(this)} />
                                                </CCol>
                                                <CCol md={5}>
                                                    <CFormInput type="text" name="value" value={this.state.lt.value} placeholder="Value" onChange={this.ltOnChangeHandler.bind(this)} />
                                                </CCol>

                                                <CCol md={2} className='d-flex justify-content-between'>
                                                    <CButton onClick={this.addLtField.bind(this, false)} color="danger"><CIcon icon={icon.cilTrash} size="l" /></CButton>

                                                </CCol>
                                            </CRow>

                                        </CForm>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol md={12}>
                                        <CButton onClick={this.addLtField.bind(this, true)} color="dark" className='mt-1 mb-1'><CIcon icon={icon.cilPlus} size="l" />Add Less Than Field</CButton>
                                    </CCol>
                                </CRow>
                                <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>Greater Than</CCardHeader>
                                <CRow className={this.state.gtVisible == true ? "" : "visually-hidden"}>
                                    <CCol md={12}>
                                        <CForm>
                                            <CRow>
                                                <CCol md={5}>
                                                    <CFormInput type="text" name="field" value={this.state.gt.field} placeholder="Field" onChange={this.gtOnChangeHandler.bind(this)} />
                                                </CCol>
                                                <CCol md={5}>
                                                    <CFormInput type="text" name="value" value={this.state.gt.value} placeholder="Value" onChange={this.gtOnChangeHandler.bind(this)} />
                                                </CCol>

                                                <CCol md={2} className='d-flex justify-content-between'>
                                                    <CButton onClick={this.addGtField.bind(this, false)} color="danger"><CIcon icon={icon.cilTrash} size="l" /></CButton>

                                                </CCol>
                                            </CRow>

                                        </CForm>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol md={12}>
                                        <CButton onClick={this.addGtField.bind(this, true)} color="dark" className='mt-1 mb-1'><CIcon icon={icon.cilPlus} size="l" />Add Greater Than Field</CButton>
                                    </CCol>
                                </CRow>
                                <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>Order By</CCardHeader>
                                <CRow className={this.state.orderbyVisible == true ? "" : "visually-hidden"}>
                                    <CCol md={12}>
                                        <CForm>
                                            <CRow>
                                                <CCol md={5}>
                                                    <CFormInput type="text" name="field" value={this.state.orderby.field} placeholder="Field" onChange={this.orderbyOnChangeHandler.bind(this)} />
                                                </CCol>
                                                <CCol md={5}>
                                                    <CFormSelect name="type" onChange={this.orderbyOnChangeHandler.bind(this)} as="select" className="mx-1 mb-3">
                                                        <option name="type" value="">Choose Order Type</option>
                                                        <option name="type" value="asc">Ascending</option>
                                                        <option name="type" value="desc">Descending</option>
                                                    </CFormSelect>
                                                </CCol>

                                                <CCol md={2} className='d-flex justify-content-between'>
                                                    <CButton onClick={this.addOrderByField.bind(this, false)} color="danger"><CIcon icon={icon.cilTrash} size="l" /></CButton>

                                                </CCol>
                                            </CRow>

                                        </CForm>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol md={12}>
                                        <CButton onClick={this.addOrderByField.bind(this, true)} color="dark" className='mt-1 mb-1'><CIcon icon={icon.cilPlus} size="l" />Add Order By Field</CButton>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol>
                        <CCard>
                            <CCardBody>
                                <CRow>
                                    <CFormSelect onChange={this.collectionChanged.bind(this)} as="select" className="mx-1 mb-3">
                                        {
                                            this.state.collections.map((item, index) => (
                                                <option name="type" value={item}>{item}</option>
                                            ))
                                        }
                                    </CFormSelect>
                                </CRow>
                                <CRow>
                                    <JSONPretty
                                        json={this.state.activeCollection}
                                        theme={currentTheme}
                                    />
                                </CRow>
                                <div className='d-flex flex-row-reverse'>
                                    <CButton size='sm' className="m-2" onClick={this.prevStepKey.bind(this)}>Previous Step</CButton>
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>

            </CContainer>
        )
    }
}
export default CollectionQuery