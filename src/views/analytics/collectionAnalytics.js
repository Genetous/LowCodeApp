import React, { Component } from 'react';
import { verify, login, Methods, post, MethodTypes } from '../../api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import JSONPretty from 'react-json-prettify';
import { tomorrowNight as currentTheme } from 'react-json-prettify/dist/themes';
import { Stepper } from 'react-form-stepper';
import { DatetimePicker } from 'rc-datetime-picker';
import 'rc-datetime-picker/dist/picker.min.css';
import AddCollection from "../operations/AddCollection"
import AddRelation from "../operations/AddRelation"
import UpdateCollection from "../operations/UpdateCollection"
import DeleteCollection from "../operations/DeleteCollection"
import DeleteRelation from "../operations/DeleteRelation"
import moment from 'moment';
import { CSVReader } from 'react-papaparse'
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
    CContainer,
    CNav,
    CNavItem,
    CNavLink,
    CTabPane,
    CTabContent
} from '@coreui/react'
import { cilCopy } from '@coreui/icons';
export class CollectionAnalytics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collectionTypes: ["Collection", "Relation"],
            activeType: "",
            activeCollection: "",
            collections: [],
            activeCollectionContent: [],
            activeSelectedCollectionContent: [],
            typeName: "",
            activeStep: 0,
            activeStepKey: 0,
            moment: moment(),
            activeKey: 1,
            fields: [],
            method: "mapCollectionAnalytics",
            react_method: "MapCollectionAnalytics",
            reactString: "{}",
            collectionSend: {
                collectionName: "",
                query: {}
            },
            MethodType: {},
            contentString: "",
            collectionString: "",
            reactString: "{}",

        }
    }
    
    nextStep() {
       this.props.nextStep()
    }

    prevStep() {
       this.props.prevStep()
    }
    nextStepKey() {
        var n = this.state.activeStepKey
        n++
        this.setState({ activeStepKey: n })
        this.setCode(this.state.collectionSend, "contentString")
    }

    prevStepKey() {
        var n = this.state.activeStepKey
        if (n > 0)
            n--
        this.setState({ activeStepKey: n })
        this.setCode(this.state.collectionSend, "contentString")
    }
    async setCode(st, ctn) {
        var collectionSend = { ...this.state.collectionSend }
        collectionSend["collectionName"] =this.props.activeCollection
        await this.setState({ collectionSend })
        this.props.onUpdateCollection(this.state.collectionSend)
    }
    async keyChanged(val, e) {
        var checked = e.target.checked
        var collectionSend = { ...this.state.collectionSend }
        collectionSend["key"] = val
        await this.setState({ collectionSend })
        this.setCode(this.state.collectionSend, "contentString", false)
    }
    async valueChanged(val, e) {
        var checked = e.target.checked
        var collectionSend = { ...this.state.collectionSend }
        collectionSend["value"] = val
        await this.setState({ collectionSend })
        this.setCode(this.state.collectionSend, "contentString", false)
    }
    async queryChanged(val, e) {
        var checked = e.target.checked
        var collectionSend = { ...this.state.collectionSend }
        collectionSend["query"]["qkey"] = val
        await this.setState({ collectionSend })
        this.setCode(this.state.collectionSend, "contentString", false)
    }
    async inChanged(v, e) {
        var collectionSend = { ...this.state.collectionSend }
        var val = e.target.value;
        if (val.toString().trim() === "") {
            if (v in collectionSend["query"]) {
                delete collectionSend.query[v]
            }
        } else {
            collectionSend["query"][v] = val;
        }
        await this.setState({
            collectionSend
        });
        this.setCode(this.state.collectionSend, "contentString")
    }
    async collectionChanged(e) {
        this.props.getCollectionContentRequest(e.target.value);
    }
    render() {
       
        return (
            <CContainer>
                <CRow>
                    <CCard className="mb-4">
                        <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>Choose Data</CCardHeader>
                        <CCardBody className='m-1'>
                            <CRow>
                                <CCol md={6} lg={6}>
                                    <CRow>
                                        <CCol sm={12} md={12} >
                                            <CFormSelect onChange={this.collectionChanged.bind(this)} as="select" className="mb-3">
                                                {
                                                    this.props.collections.map((item, index) => (
                                                        <option name="type" value={item}>{item}</option>
                                                    ))
                                                }
                                            </CFormSelect>
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCard className="mb-4">
                                            <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>{this.props.typeName + " : " + this.props.activeCollection}</CCardHeader>
                                            <CCardBody className='m-1'>
                                                <Stepper
                                                    steps={[{ label: 'Choose Key' }, { label: 'Choose Value' }, { label: 'Create Query' }]}
                                                    activeStep={this.state.activeStepKey}
                                                />
                                                <CCol>

                                                    <CRow className={this.state.activeStepKey == 0 ? "" : "visually-hidden"}>
                                                        <CCol sm={12} md={12}>
                                                            {
                                                                this.props.fields.map((item, index) => (
                                                                    <CFormCheck type="radio" id="flexCheckDefault" className='p-2' name="field" label={item} onChange={this.keyChanged.bind(this, item)} />
                                                                ))
                                                            }
                                                        </CCol>
                                                        <div className='d-flex flex-row-reverse'>
                                                            <CButton size='sm' className="m-2" onClick={this.nextStepKey.bind(this)}>Next Step</CButton>
                                                        </div>
                                                    </CRow>
                                                    <CRow className={this.state.activeStepKey == 1 ? "" : "visually-hidden"}>
                                                        <CCol sm={12} md={12}>
                                                            {
                                                                this.props.fields.map((item, index) => (
                                                                    <CFormCheck type="radio" id="flexCheckDefault" className='p-2' name="field" label={item} onChange={this.valueChanged.bind(this, item)} />
                                                                ))
                                                            }
                                                        </CCol>
                                                        <div className='d-flex flex-row-reverse'>
                                                            <CButton size='sm' className="m-2" onClick={this.nextStepKey.bind(this)}>Next Step</CButton>
                                                            <CButton size='sm' className="m-2" onClick={this.prevStepKey.bind(this)}>Previous Step</CButton>
                                                        </div>
                                                    </CRow>
                                                    <CRow className={this.state.activeStepKey == 2 ? "" : "visually-hidden"}>

                                                        <CCol sm={12} md={12}>
                                                            <CRow >
                                                                <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2 mb-2'>Choose Query Key</CCardHeader>
                                                                <CCol>
                                                                    {
                                                                        this.props.fields.map((item, index) => (
                                                                            <CFormCheck type="radio" id="flexCheckDefault" className='p-2' name="field" label={item} onChange={this.queryChanged.bind(this, item)} />
                                                                        ))
                                                                    }
                                                                </CCol>
                                                            </CRow>
                                                            <CRow>
                                                                <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>Filter</CCardHeader>
                                                                <CCol>
                                                                    <CRow className='mb-2'>
                                                                        <CFormInput type="text" name="lt" placeholder="Less Than" onChange={this.inChanged.bind(this, "lt")} />
                                                                    </CRow>
                                                                    <CRow>
                                                                        <CFormInput type="text" name="gt" placeholder="Greater Than" onChange={this.inChanged.bind(this, "gt")} />
                                                                    </CRow>
                                                                </CCol>
                                                            </CRow>
                                                        </CCol>
                                                        <div className='d-flex flex-row-reverse'>
                                                            <CButton size='sm' className="m-2" onClick={this.prevStepKey.bind(this)}>Previous Step</CButton>
                                                        </div>
                                                    </CRow>
                                                </CCol>
                                            </CCardBody>
                                        </CCard>
                                    </CRow>
                                </CCol>
                                <CCol>
                                    {this.props.activeCollectionContent.length > 0 &&
                                        <CCol md={6} lg={12}>
                                            <CCard className="mb-4">
                                                <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>{this.props.typeName + " : " + this.props.activeCollection}</CCardHeader>
                                                <CCardBody className='m-1'>
                                                    <CRow>

                                                        <JSONPretty
                                                            json={this.props.activeCollectionContent[0]}
                                                            theme={currentTheme}
                                                        />

                                                    </CRow>
                                                </CCardBody>
                                            </CCard>
                                        </CCol>
                                    }
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                    <div className='d-flex flex-row-reverse'>
                        <CButton size='sm' className="m-2" onClick={this.prevStep.bind(this)}>Previous Step</CButton>
                    </div>
                </CRow>
            </CContainer>
        )
    }
}
export default CollectionAnalytics