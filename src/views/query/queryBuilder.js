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
import { Iterate, setReact,IterateiOS } from "../../iterator"
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
import RelationQuery from './relationQuery';
import CollectionQuery from './collectionQuery';
export class QueryBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collectionTypes: ["Collection", "Relation"],
            collections: [],
            collection: {},
            activeCollection: null,
            activeCollectionContent: [],
            deleteModal: false,
            beingDeletedRelationID: null,
            beingDeletedRelationTO: null,
            contentString: "",
            activeKey: 1,
            method: "",
            react_method: "",
            void: "",
            clickHandler: "",
            reactString: "{}",
            iosString:"[]",
            activeStep: 0,
            activeType: ""
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
            if (aType == "Collection") {
                this.setState({ void: "get_collection()", method: "getCollections", react_method: "GetCollections", clickHandler: "getCollectionsOnClickHandler() {\n" })
            } else {
                this.setState({ void: "get_relation()", method: "getRelations", react_method: "GetRelations", clickHandler: "getRelationsOnClickHandler() {\n" })
            }
        } else {
            console.log(hata);
        }

    }
    getContent() {
        if (this.state.activeType == "Collection") {

            return (<CollectionQuery onUpdateCollection={this.onUpdateCollection.bind(this)}
                prevStepKey={this.prevStepKey.bind(this)}
            />)
        } else if (this.state.activeType == "Relation") {

            return (<RelationQuery onUpdateCollection={this.onUpdateCollection.bind(this)}
                prevStepKey={this.prevStepKey.bind(this)}
                collections={this.state.collections} />)

        }
    }
    nextStepKey() {
        if (this.state.activeType === "")
            return
        var n = this.state.activeStep
        n++
        this.setState({ activeStep: n })
        this.setCode()
    }

    prevStepKey() {
        var n = this.state.activeStep
        if (n > 0)
            n--
        this.setState({ activeStep: n, collections: [], activeType: "" })
        this.setCode()
    }
    async onUpdateCollection(collectionData) {
        var collection = { ...this.state.collection }
        collection = collectionData
        await this.setState({ collection })
        this.setCode()
    }
    async setCode() {
        var strd = ""
        var sc = "{}"
        var item = this.state.collection
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
    render() {
        return (
            <CContainer>
                <Stepper
                    steps={[{ label: 'Choose Collection Type' }, { label: 'Create Query' }]}
                    activeStep={this.state.activeStep}
                />
                <CRow className={this.state.activeStep == 0 ? "" : "visually-hidden"}>
                    <CCol>
                        <CRow className='justify-content-center'>
                            <CCol sm={12} md={6}>
                                <CFormSelect onChange={this.collectionTypeChanged.bind(this)} value={this.state.activeType} as="select" className="mx-1 mb-3">
                                    <option name="type" value="">Choose Collection Type</option>
                                    {
                                        this.state.collectionTypes.map((item, index) => (
                                            <option name="type" value={item}>{item}</option>
                                        ))
                                    }
                                </CFormSelect>
                                <div className='d-flex flex-row-reverse'>
                                    <CButton size='sm' className="m-2" onClick={this.nextStepKey.bind(this)}>Next Step</CButton>
                                </div>
                            </CCol>
                        </CRow>
                    </CCol>
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
                            <div><CButton className='float-end' size='sm' color='secondary' onClick={this.copyText.bind(this, "android")}><CIcon icon={icon.cilCopy} size="xs" /> Copy</CButton></div>
                            <div id="android">
                                <pre><span className='import'>{"import"}</span>{" com.mubo.genetous_http.PostGet;\n" +
                                    ""}<span className='import'>{"import"}</span>{" com.mubo.genetous_http.PostGetBuilder;\n" +
                                        ""}<span className='import'>{"import"}</span>{" com.mubo.genetous_http.response;\n" +
                                            ""}<span className='import'>{"import"}</span>{" org.json.JSONObject\n\n"}
                                </pre>
                                <pre className='code_void'>{"void "}<span className='code_void_name'>{this.state.void}</span><span>{"{\n"}</span></pre>

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
                            <div><CButton className='float-end' size='sm' color='secondary' onClick={this.copyText.bind(this, "react")}><CIcon icon={icon.cilCopy} size="xs" /> Copy</CButton></div>
                            <div id="react">
                                <pre><span className='code_void'>{"import"}</span>{" {Methods,post} "}<span className='code_void'>{"from "}</span>{"\"genetous_react\"\n\n"}</pre>
                                <pre><span className='import'>{"async "}</span><span className=''>{this.state.clickHandler}</span></pre>

                                <pre className='px-5'>
                                    <span className='import'>{"const "}</span>{"modal = " + this.state.reactString + "\n\n"
                                    }
                                    <span className='await'>{"await "}</span>{"post(modal, Methods." + this.state.react_method + ").then("}<span className='import'>{"function "}</span>{"(result) {\n" +
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
export default QueryBuilder