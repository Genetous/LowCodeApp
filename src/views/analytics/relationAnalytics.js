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
export class RelationAnalytics extends Component {

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
                query: {}
            },
            MethodType: {},
            contentString: "",
            collectionString: "",
            reactString: "{}",
            choosenPath: "",
            firstFilter: "",
            secondFilter: ""

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
        collectionSend["relationName"] =this.props.activeCollection
        await this.setState({ collectionSend })
        this.props.onUpdateCollection(this.state.collectionSend)
    }
    async keyChanged(val, e) {
        var collectionSend = { ...this.state.collectionSend }
        collectionSend[e.target.name] = val
        await this.setState({ collectionSend })
        this.setCode(this.state.collectionSend, "contentString", false)
    }

    async valueChanged(e) {
        var val = e.target.value
        var collectionSend = { ...this.state.collectionSend }
        collectionSend[e.target.name] = val
        await this.setState({ collectionSend })
        this.setCode(this.state.collectionSend, "contentString", false)
    }

    async queryChanged(val, e) {
        var collectionSend = { ...this.state.collectionSend }
        collectionSend["query"][e.target.name] = val
        await this.setState({ collectionSend, choosenPath: val })
        this.setCode(this.state.collectionSend, "contentString", false)
    }
    async queryFieldChanged(val, e) {
        var collectionSend = { ...this.state.collectionSend }
        collectionSend["query"][e.target.name] = collectionSend["query"][e.target.name] != null && collectionSend["query"][e.target.name] != "" ? collectionSend["query"][e.target.name] : ""
        if (val == "first") {
            await this.setState({ firstFilter: e.target.name })
        } else {
            await this.setState({ secondFilter: e.target.name })
        }
        await this.setState({ collectionSend })
        this.setCode(this.state.collectionSend, "contentString", false)
    }
    async queryValueChanged(e) {
        var collectionSend = { ...this.state.collectionSend }
        collectionSend["query"][e.target.name] = e.target.value
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
        var collectionSend = { ...this.state.collectionSend }
        collectionSend.query={}
        await this.setState({ collectionSend })
        this.props.getCollectionContentRequest(e.target.value);
    }
    render() {
        const pathList = []
        const pathListNorm = []
        const itemList = []
        this.props.fields.map((item, index) => {
            var p = item.split(".")
            var pd = ""
            var girdi = false
            for (var i = 0; i < p.length - 1; ++i) {
                if (isNaN(p[i]) && p[0] == "content") {
                    girdi = true
                    if (i == 0) {
                        pd += p[i]
                    } else {
                        pd += "." + p[i]
                    }
                }
            }
            if (girdi && !pathList.includes(pd)) {
                var pl = pd.split(".")
                if (pl[pl.length - 1] == "content") {
                    pathList.push(pd)
                }
            }
        })
        this.props.fields.map((item, index) => {
            var p = item.split(".")
            var pd = ""
            var girdi = false
            for (var i = 0; i < p.length; ++i) {
                if (isNaN(p[i])) {
                    girdi = true
                    if (i == 0) {
                        pd += p[i]
                    } else {
                        pd += "." + p[i]
                    }
                }
            }
            if (girdi) {
                var pl = pd.split(".")
                if (pl[pl.length - 1] != "_id" &&pl[pl.length - 1] != "collectionName") {
                    pathListNorm.push(pd)
                }
            }
        })
        pathListNorm.map((item, index) => {
            var p = item.split(".")
            var choosen = this.state.choosenPath.split(".")
            var pd = ""
            var girdi = false
            if (p.length - 1 == choosen.length && p[0] == "content") {
                var devam = true
                for (var i = 0; i < p.length; ++i) {
                    for (var c = 0; c < choosen.length; ++c) {
                        if (c == i) {
                            if (choosen[c] != p[i]) {
                                devam = false
                                break;
                            }
                        }
                    }
                    if (!devam) {
                        break;
                    }
                }
                if (devam) {
                    for (var i = p.length - 1; i < p.length; ++i) {
                        if (isNaN(p[i])) {
                            girdi = true
                            pd += p[i]
                        }
                    }
                    if (girdi) {
                        itemList.push(pd)
                    }
                }
            }
        })
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
                                                    steps={[{ label: 'Choose First Key' }, { label: 'Choose Second Key' }, { label: 'First Tag' }, { label: 'Second Tag' }, { label: 'Choose Path' }, { label: 'First Filter Key' }, { label: 'Second Filter Key' }]}
                                                    activeStep={this.state.activeStepKey}
                                                />
                                                <CCol>

                                                    <CRow className={this.state.activeStepKey == 0 ? "" : "visually-hidden"}>
                                                        <CCol sm={12} md={12}>
                                                            {
                                                                pathListNorm.map((item, index) => (
                                                                    <CFormCheck type="radio" id="flexCheckDefault" className='p-2' name="key1" label={item} onChange={this.keyChanged.bind(this, item)} />
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
                                                                pathListNorm.map((item, index) => (
                                                                    <CFormCheck type="radio" id="flexCheckDefault" className='p-2' name="key2" label={item} onChange={this.keyChanged.bind(this, item)} />
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
                                                            <CFormInput type="text" id="flexCheckDefault" placeholder="First Tag" name="tag1" onChange={this.valueChanged.bind(this)} />
                                                        </CCol>
                                                        <div className='d-flex flex-row-reverse'>
                                                            <CButton size='sm' className="m-2" onClick={this.nextStepKey.bind(this)}>Next Step</CButton>
                                                            <CButton size='sm' className="m-2" onClick={this.prevStepKey.bind(this)}>Previous Step</CButton>
                                                        </div>
                                                    </CRow>
                                                    <CRow className={this.state.activeStepKey == 3 ? "" : "visually-hidden"}>
                                                        <CCol sm={12} md={12}>
                                                            <CFormInput type="text" id="flexCheckDefault" placeholder="Second Tag" name="tag2" onChange={this.valueChanged.bind(this)} />
                                                        </CCol>
                                                        <div className='d-flex flex-row-reverse'>
                                                            <CButton size='sm' className="m-2" onClick={this.nextStepKey.bind(this)}>Next Step</CButton>
                                                            <CButton size='sm' className="m-2" onClick={this.prevStepKey.bind(this)}>Previous Step</CButton>
                                                        </div>
                                                    </CRow>
                                                    <CRow className={this.state.activeStepKey == 4 ? "" : "visually-hidden"}>
                                                        <CCol sm={12} md={12}>
                                                            {

                                                                pathList.map((item, index) => (
                                                                    <CFormCheck type="radio" id="flexCheckDefault" className='p-2' name="path" label={item} onChange={this.queryChanged.bind(this, item)} />
                                                                ))
                                                            }
                                                        </CCol>
                                                        <div className='d-flex flex-row-reverse'>
                                                            <CButton size='sm' className="m-2" onClick={this.nextStepKey.bind(this)}>Next Step</CButton>
                                                            <CButton size='sm' className="m-2" onClick={this.prevStepKey.bind(this)}>Previous Step</CButton>
                                                        </div>
                                                    </CRow>
                                                    <CRow className={this.state.activeStepKey == 5 ? "" : "visually-hidden"}>
                                                        <CCol sm={12} md={12}>
                                                            <CRow>
                                                                {

                                                                    itemList.map((item, index) => (
                                                                        <CFormCheck type="radio" id="flexCheckDefault" className='p-2' name={item} label={item} onChange={this.queryFieldChanged.bind(this, "first")} />
                                                                    ))
                                                                }
                                                            </CRow>
                                                            <CRow>
                                                                <CFormInput type="text" id="flexCheckDefault" placeholder="Value" name={this.state.firstFilter} onChange={this.queryValueChanged.bind(this)} />
                                                            </CRow>
                                                        </CCol>
                                                        <div className='d-flex flex-row-reverse'>
                                                            <CButton size='sm' className="m-2" onClick={this.nextStepKey.bind(this)}>Next Step</CButton>
                                                            <CButton size='sm' className="m-2" onClick={this.prevStepKey.bind(this)}>Previous Step</CButton>
                                                        </div>
                                                    </CRow>
                                                    <CRow className={this.state.activeStepKey == 6 ? "" : "visually-hidden"}>
                                                        <CCol sm={12} md={12}>
                                                            <CRow>
                                                                {

                                                                    itemList.map((item, index) => (
                                                                        <CFormCheck type="radio" id="flexCheckDefault" className='p-2' name={item} label={item} onChange={this.queryFieldChanged.bind(this, "second")} />
                                                                    ))
                                                                }
                                                            </CRow>
                                                            <CRow>
                                                                <CFormInput type="text" id="flexCheckDefault" placeholder="Value" name={this.state.secondFilter} onChange={this.queryValueChanged.bind(this)} />
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
export default RelationAnalytics