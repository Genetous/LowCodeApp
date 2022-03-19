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
import CollectionAnalytics from "../analytics/collectionAnalytics"
import RelationAnalytics from "../analytics/relationAnalytics"
import moment from 'moment';
import { CSVReader } from 'react-papaparse'
import { Iterate, setReact } from "../../iterator"
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
import { getIconsView } from '../icons/brands/Brands';
import { IterateiOS } from 'src/iterator';
export class analytic extends Component {

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
            },
            MethodType: {},
            contentString: "",
            collectionString: "",
            reactString: "{}",
            iosString: "[]"

        }
    }

    nextStep() {
        var n = this.state.activeStep
        n++
        this.setState({ activeStep: n })
        this.setCode(this.state.collectionSend, "contentString")
    }

    prevStep() {
        var n = this.state.activeStep
        if (n > 0)
            n--
        this.setState({ activeStep: n })
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
    async copyText(id) {
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
    async setCode(st, ctn) {
        var strd = ""
        var sc = "{}"
        var item = st
        await Iterate(item, strd, "sendObject", 0, "").then(function (result) {
            strd = result
        }, err => {
        });
        this.setState({ contentString: strd })
        await setReact(item).then(function (result) {
            sc = result
        }, err => {
        });
        this.setState({ reactString: sc })
        var ios = ""
        await IterateiOS(sc).then(function (result) {
            ios = result
        }, err => {
        });

        this.setState({ iosString: ios })
    }

    async collectionTypeChanged(e) {
        var onay = false
        var hata = ""
        var res = ""
        var aType = e.target.value
        if (e.target.value === "") {
            await this.setState({
                collections: [],
                activeType: ""
            });
            return
        }
        var method = e.target.value == "Collection" ? Methods.GetCollections : Methods.GetRelations
        const model = {
            "distinct": e.target.value == "Collection" ? "collectionName" : "relationName"
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
                collections: col.values,
                activeType: aType,
            });
            this.getCollectionContentRequest(col.values[0]);
        } else {
            console.log(hata);
        }
        this.setCode(this.state.collectionSend, "contentString")
    }
    async collectionChanged(e) {
        this.getCollectionContentRequest(e.target.value);
    }
    async getCollectionContentRequest(collection) {
        var onay = false
        var hata = ""
        var res = ""
        var col = null
        const tName = this.state.activeType === "Collection" ? "collectionName" : "relationName"
        var method = this.state.activeType === "Collection" ? Methods.GetCollections : Methods.GetRelations
        this.setState({ activeCollection: collection, typeName: tName });
        var model = {}
        model[tName] = collection
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
        var collectionSend = { ...this.state.collectionSend }
        collectionSend = {}
        if (onay) {
            var c_arr = [col.values[0]]
            var arr = []
            var val = this.convertJsonToDot(col.values[0], [], [])
            Object.keys(val).map((item, index) => {
                if (item.indexOf("content.") > -1)
                    arr.push(item)
            });
            await this.setState({ fields: arr, activeCollectionContent: c_arr, collectionSend })
            this.setCode(this.state.collectionSend, "contentString", false)
        } else {
            await this.setState({ fields: [], activeCollectionContent: [], collectionSend })
            this.setCode(this.state.collectionSend, "contentString", false)
        }
    }
    convertJsonToDot(obj, parent = [], keyValue = {}) {
        for (let key in obj) {
            let keyPath = [...parent, key];
            if (obj[key] !== null && typeof obj[key] === 'object') {
                Object.assign(keyValue, this.convertJsonToDot(obj[key], keyPath, keyValue));
            } else {
                keyValue[keyPath.join('.')] = obj[key];
            }
        }
        return keyValue;
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
    getContent() {
        if (this.state.activeType == "Collection") {
            return (<CollectionAnalytics onUpdateCollection={this.onUpdateCollection.bind(this)}
                collections={this.state.collections} fields={this.state.fields}
                getCollectionContentRequest={this.getCollectionContentRequest.bind(this)}
                activeCollectionContent={this.state.activeCollectionContent}
                typeName={this.state.typeName}
                activeCollection={this.state.activeCollection}
                prevStep={this.prevStep.bind(this)}
                nextStep={this.nextStep.bind(this)}
            />)
        } else if (this.state.activeType == "Relation") {
            return (<RelationAnalytics onUpdateCollection={this.onUpdateCollection.bind(this)}
                collections={this.state.collections} fields={this.state.fields}
                getCollectionContentRequest={this.getCollectionContentRequest.bind(this)}
                activeCollectionContent={this.state.activeCollectionContent}
                typeName={this.state.typeName}
                activeCollection={this.state.activeCollection}
                prevStep={this.prevStep.bind(this)}
                nextStep={this.nextStep.bind(this)} />)
        }
    }
    async onUpdateCollection(collection) {
        var collectionSend = { ...this.state.collectionSend }
        collectionSend = collection
        await this.setState({ collectionSend })
        this.setCode(this.state.collectionSend, "contentString")
    }
    render() {

        return (
            <CContainer>
                <ToastContainer />
                <Stepper
                    steps={[{ label: 'Choose Collection Type' }, { label: 'Choose Data' }]}
                    activeStep={this.state.activeStep}
                />

                <CRow className={this.state.activeStep == 0 ? "" : "visually-hidden"}>
                    <CCol md={12} lg={12} >

                        <CRow >
                            <CCard className="mb-4">
                                <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>Choose Collection Type</CCardHeader>
                                <CCardBody>
                                    <CRow className='justify-content-center'>
                                        <CCol sm={12} md={6}>
                                            <CFormSelect onChange={this.collectionTypeChanged.bind(this)} as="select" className="mx-1 mb-3">
                                                <option name="type" value="">Choose Collection Type</option>
                                                {
                                                    this.state.collectionTypes.map((item, index) => (
                                                        <option name="type" value={item}>{item}</option>
                                                    ))
                                                }
                                            </CFormSelect>
                                        </CCol>
                                    </CRow>

                                    
                                </CCardBody>
                            </CCard>
                        </CRow>
                    </CCol>
                    <div className='d-flex flex-row-reverse'>
                        <CButton size='sm' className="m-2" onClick={this.nextStep.bind(this)}>Next Step</CButton>
                    </div>
                </CRow>

                <CRow className={this.state.activeStep == 1 ? "" : "visually-hidden"}>
                    {
                        this.getContent()
                    }
                </CRow>

                <CRow>
                    <CNav variant="tabs" role="tablist">
                        <CNavItem>
                            <CNavLink
                                href="javascript:void(0);"
                                active={this.state.activeKey === 1}
                                onClick={() => this.setState({ activeKey: 1 })}
                            >
                                Android Native(Java)
                            </CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink
                                href="javascript:void(0);"
                                active={this.state.activeKey === 2}
                                onClick={() => this.setState({ activeKey: 2 })}
                            >
                                iOS Native(Swift)
                            </CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink
                                href="javascript:void(0);"
                                active={this.state.activeKey === 3}
                                onClick={() => this.setState({ activeKey: 3 })}

                            >
                                ReactJS
                            </CNavLink>
                        </CNavItem>
                    </CNav>
                    <CTabContent className='code_back p-3'>
                        <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
                            <div><CButton className='float-end' size='sm' color='secondary' onClick={this.copyText.bind(this, "android")}><CIcon icon={cilCopy} size="xs" /> Copy</CButton></div>
                            <div id="android">
                                <pre><span className='import'>{"import"}</span>{" com.mubo.genetous_http.PostGet;\n" +
                                    ""}<span className='import'>{"import"}</span>{" com.mubo.genetous_http.PostGetBuilder;\n" +
                                        ""}<span className='import'>{"import"}</span>{" com.mubo.genetous_http.response;\n" +
                                            ""}<span className='import'>{"import"}</span>{" org.json.JSONObject\n\n"}
                                </pre>
                                <pre className='code_void'>{"void "}<span className='code_void_name'>{"getAnalytics()"}</span><span>{"{\n"}</span></pre>

                                <pre className='px-5'>{"JSONObject sendObject=new JSONObject();\n" +
                                    "" + this.state.contentString
                                }
                                    <br />
                                    <span className='code_void'>{"new "}</span>{"PostGetBuilder()\n" +
                                        ".setActivity("}<span className='code_void'>this</span>{")\n" +
                                            ".setMethod(PostGet.REQUEST_METHODS."}<span className='property'>{"POST"}</span>{")\n" +
                                                ".setToken(token)\n" +
                                                ".setJsonPostData(sendObject.toString())\n" +
                                                ".setReturn_type(PostGet.RETURN_TYPE."}<span className='property'>{"JSONOBJECT"}</span>{")\n" +
                                                    ".setHost("}<span className='str_text'>ip</span>{")\n" +
                                                        ".setUrlType(PostGet.URL_TYPE."}<span className='property'>{this.state.method}</span>{")\n" +
                                                            ".setCompletionHandler("}<span className='code_void'>{"new "}</span>{"PostGet.completionHandler() {\n" +
                                                                "    "}<span className='override'>@Override</span>{"\n" +
                                                                    "    "}<span className='code_void'>public void </span><span className='code_void_name'>onHttpFinished</span>{"(response response) {\n" +
                                                                        "        JSONObject j=response.getJsonObject();\n" +
                                                                        "         //Use Json Object\n" +
                                                                        "    }\n" +
                                                                        "})\n" +
                                                                        ".createPost()\n" +
                                                                        ".process();"
                                    }
                                </pre>
                                <pre className='code_void'>{"}"}</pre>
                            </div>
                        </CTabPane>
                        <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 2}>
                            <div><CButton className='float-end' size='sm' color='secondary' onClick={this.copyText.bind(this, "ios")}><CIcon icon={icon.cilCopy} size="xs" /> Copy</CButton></div>
                            <div id="ios">
                                <pre className='px-2'><span className='ios_red'>import </span><span className='ios_purple'>genetousSDK</span></pre>{"\n"}
                                <pre className='px-2'>{<span className='ios_red'>let</span>}{" postGetBuilder = "}<span className='ios_blue'>{"PostGetBuilder"}</span>()</pre>{"\n"}

                                <pre className='px-2'><span className='ios_red'>{"func "}</span><span className=''>{this.state.method}{"() {\n"}</span></pre>

                                <pre className='px-5'>
                                    <span className='ios_red'>{"let "}</span>{"collection:"}<span className='ios_red'>{"Any = "}</span>
                                    <span>{this.state.iosString}</span>
                                    <span> {"\n"}</span>


                                    <br />
                                    {"postGetBuilder\n"}
                                    <span className='ios_blue'>{".setJsonPostData("}</span>collection{")\n"}
                                    <span className='ios_blue'>{".setPost_type"}</span>(POST_TYPE.JSON){"\n"}
                                    <span className='ios_blue'>{".setMethod"}</span>(REQUEST_METHODS.POST){"\n"}
                                    <span className='ios_blue'>{".setReturn_type"}</span>(RETURN_TYPE.JSON){"\n"}
                                    <span className='ios_blue'>{".setHost"}</span>(<span className='str_text'>ip</span>){"\n"}
                                    <span className='ios_blue'>{".setUrlType"}</span>(URL_TYPE.{this.state.method}.description{")\n"}
                                    <span className='ios_blue'>{".setToken"}</span>(token){"\n"}

                                    <span className='ios_blue'>{".createPost"}</span>(){"\n"}
                                    <span className='ios_blue'>{".process"}</span>(){"{response "}<span className='ios_red'>in</span>{"\n"}
                                    <span>{"  DispatchQueue.main.async {\n"}</span>
                                    <span className='ios_red'>    let </span>data:<span className='ios_blue'>NSDictionary</span> = response?.JsonObject{"\n"}
                                    <span>{"  }\n"}</span>
                                    <span>{"}\n"}</span>


                                </pre>
                                <pre className='px-2'>{"}"}</pre>
                            </div>
                        </CTabPane>
                        <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={this.state.activeKey === 3}>
                            <div><CButton className='float-end' size='sm' color='secondary' onClick={this.copyText.bind(this, "react")}><CIcon icon={cilCopy} size="xs" /> Copy</CButton></div>
                            <div id="react">
                                <pre><span className='code_void'>{"import"}</span>{" {Methods,post} "}<span className='code_void'>{"from "}</span>{"\"genetous_react\"\n\n"}</pre>
                                <pre><span className='import'>{"async "}</span><span className=''>{"getAnalyticsOnClickHandler() {\n"}</span></pre>

                                <pre className='px-5'>
                                    <span className='import'>{"const "}</span>{"collection = " + this.state.reactString + "\n\n"
                                    }
                                    <span className='await'>{"await "}</span>{"post(collection, Methods." + this.state.react_method + ").then("}<span className='import'>{"function "}</span>{"(result) {\n" +
                                        "   //result as JSON\n" +
                                        "}, err => {\n" +
                                        "   //error result\n" +
                                        "});"
                                    }
                                </pre>
                                <pre className=''>{"}"}</pre>
                            </div>
                        </CTabPane>
                    </CTabContent>
                </CRow>
            </CContainer>
        )
    }
}
export default analytic