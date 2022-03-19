import React, { Component } from 'react'
import axios from 'axios';
import JSONEditor from '../widgets/JSONEditor/JSONEditor';
import { verify, login, Methods, post } from '../../api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { IterateiOS } from 'src/iterator';
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
    CListGroup,
    CListGroupItem,
    CCardHeader,
    CForm,
    CFormLabel,
    CButton,
    CFormInput,
    CFormSelect,
    CFormCheck,
    CContainer,
    CNav,
    CNavItem,
    CNavLink,
    CTabPane,
    CTabContent
} from '@coreui/react'
export default class Update extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collections: [],
            activeCollection: null,
            activeCollectionContent: [],
            contentInputs: [],
            activeKey: 1,
            contentString: "",
            collectionString: "",
            method: "updateCollection",
            id: "",
            react_method: "UpdateCollection",
            reactString: "{}",
            iosString:"[]"
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
    componentDidMount() {
        this.getMyCollectionsRequest();
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
    async getMyCollectionsRequest() {
        var onay = false
        var hata = ""
        var res = ""
        const model = {
            "distinct": "collectionName"
        }
        var col = null;
        await post(model, Methods.GetCollections).then(function (result) {
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
    changeActiveCollection(collection) {
        this.getCollectionContentRequest(collection);
    }

    async getCollectionContentRequest(collection) {
        var onay = false
        var hata = ""
        var res = ""
        var col = null
        this.setState({ activeCollection: collection });
        const model = {
            "collectionName": collection
        }
        await post(model, Methods.GetCollections).then(function (result) {
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
            var vals = [col.values[0]]
            var inputs = []
            Object.keys(vals[0].content).forEach(function (key) {
                var isJArray = Object.prototype.toString.call(vals[0].content[key]) === '[object Array]'
                if (isJArray) {
                    var val = ""
                    vals[0].content[key].forEach((item) => {
                        val += item + ","
                    })
                    val = val.slice(0, -1);
                    inputs.push({ field: key, value: val, type: "String", isUnique: false, isArray: true })
                }
                else {
                    inputs.push({ field: key, value: vals[0].content[key], type: "String", isUnique: false, isArray: false })
                }
            })

            this.setState({
                contentInputs: inputs,
                activeCollectionContent: vals,
                id: vals[0].id
            })
            this.setCode(this.state.contentInputs, "contentString")
        } else {
            console.log(hata);
        }

    }

    contentSiblingTypeChangeHandler(index, e) {
        const { contentInputs } = this.state;
        const contentInputsCopy = [...contentInputs];
        contentInputsCopy[index].type = e.target.value;
        this.setState({
            contentInputs: contentInputsCopy
        });

    }

    contentSiblingUniqueToggler(index, e) {
        const { contentInputs } = this.state;
        const contentInputsCopy = [...contentInputs];
        contentInputsCopy[index].isUnique = !contentInputs[index].isUnique;
        this.setState({
            contentInputs: contentInputsCopy
        });
        this.setCode(this.state.contentInputs, "contentString")
    }

    contentSiblingArrayToggler(index, e) {
        const { contentInputs } = this.state;
        const contentInputsCopy = [...contentInputs];
        contentInputsCopy[index].isArray = !contentInputs[index].isArray;
        this.setState({
            contentInputs: contentInputsCopy
        });
        this.setCode(this.state.contentInputs, "contentString")
    }

    contentSiblingOnChangeHandler(index, e) {
        const { contentInputs } = this.state;
        contentInputs[index][e.target.name] = e.target.value;
        this.setState({
            contentInputs
        });

        this.setCode(this.state.contentInputs, "contentString")
    }
    setCode(st, ctn) {
        if (st.length < 1) {
            this.setState({ contentString: "" })
            return
        }
        var strd = ""
        var arr = st
        var uf = []
        if (ctn === "contentString") {
            strd = strd.concat("JSONArray fields = new JSONArray()\n")
        }
        for (var i = 0; i < arr.length; ++i) {
            var item = arr[i]
            if ("isArray" in item && item.isArray == true) {
                strd = strd.concat("JSONArray j" + String(i) + " = new JSONArray()\n")
                item.value.split(",").map((v, vv) => (
                    strd = strd.concat("j" + String(i) + ".put(\"" + v + "\")\n")
                ))
                strd = strd.concat("j" + String(i) + "_" + String(i) + ".put(\"field\",\"" + item.field + "\")\n")
                strd = strd.concat("j" + String(i) + "_" + String(i) + ".put(\"value\",\"j" + String(i) + "\")\n")
                strd = strd.concat("fields.put(\"j" + String(i) + "_" + String(i) + "\")\n")
            }
            else {
                if (ctn === "contentString") {
                    strd = strd.concat("JSONObject j" + String(i) + " = new JSONObject()\n")
                    strd = strd.concat("j" + String(i) + ".put(\"field\",\"" + item.field + "\")\n")
                    strd = strd.concat("j" + String(i) + ".put(\"value\",\"" + item.value + "\")\n")
                    strd = strd.concat("fields.put(\"j" + String(i) + "\")\n")
                }
            }
            if (item.isUnique) {
                uf.push(item.field)
            }
        }
        if (ctn === "contentString") {
            strd = strd.concat("sendObject.put(\"fields\",fields)\n")
            this.setState({ contentString: strd })
        }
        this.setReact(st)
    }
    async setReact(st) {
        var c = {
            id: this.state.id,
            fields: []
        }
        var arr = st
        for (var i = 0; i < arr.length; ++i) {
            var item = arr[i]
            if ("isArray" in item && item.isArray == true) {
                var f = {
                    "field": item.field,
                    "value": [item.value]
                }
                c.fields.push(f)
            }
            else {
                var f = {
                    "field": item.field,
                    "value": item.value
                }
                c.fields.push(f)
            }
        }
        var sc = JSON.stringify(c, null, 4)
        if (sc === "null") {
            sc = "{}"
        }
        this.setState({ reactString: sc })
        var ios = ""
        await IterateiOS(sc).then(function (result) {
            ios = result
        }, err => {
        });

        this.setState({ iosString: ios })
    }
    async removeContentSibling(index) {
        const { contentInputs } = this.state;
        const contentInputsCopy = [...contentInputs];
        contentInputsCopy.splice(index, 1);
        await this.setState({
            contentInputs: contentInputsCopy
        })
        this.setCode(this.state.contentInputs, "contentString")
    }


    updateCollectionItemOnClickHandler(index, updatedObject) {
        console.log(updatedObject);
        console.log(index);
    }
    addNewContentSibling() {
        const { contentInputs } = this.state;
        if (contentInputs.filter(ci => ci.field === "").length == 0) {
            this.setState({
                contentInputs: [...this.state.contentInputs, { field: "", value: "", type: "String", isArray: false }]
            })
        }
    }
    getContentSiblingInput(sibling, index) {
        return (
            <CContainer>
                <CRow className='content-siblings mb-1' key={index}>
                    <CCol md={12}>
                        <CForm>
                            <CRow>
                                <CCol md={3}>
                                    <CFormInput type="text" name="field" id={sibling.field} value={sibling.field} placeholder="Field" onChange={this.contentSiblingOnChangeHandler.bind(this, index)} />
                                </CCol>
                                <CCol md={3}>
                                    <CFormInput type="text" name="value" id={sibling.value} value={sibling.value} placeholder="Value" onChange={this.contentSiblingOnChangeHandler.bind(this, index)} />
                                </CCol>
                                <CCol md={2}>
                                    <CFormSelect aria-label="Default select example" value={sibling.type} onChange={this.contentSiblingTypeChangeHandler.bind(this, index)}>
                                        <option name="type" value="String">String</option>
                                        <option name="type" value="Integer">Integer</option>
                                        <option name="type" value="Double">Double</option>
                                        <option name="type" value="Boolean">Boolean</option>
                                    </CFormSelect>
                                </CCol>
                                <CCol md={3} className='d-flex justify-content-between'>
                                    <CButton onClick={this.removeContentSibling.bind(this, index)} color="danger"><CIcon icon={icon.cilTrash} size="l" /></CButton>
                                    <CFormCheck checked={sibling.isArray} onChange={this.contentSiblingArrayToggler.bind(this, index)} label="Array" />
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCol>
                </CRow>
            </CContainer>


        )
    }
    render() {
        return (
            <CContainer>
                <CRow xs={{ cols: 1 }} md={{ cols: 2 }}>
                    <CCol md={3}>
                        <CCard className="mb-4">
                            <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>Collection Names</CCardHeader>
                            <CCardBody className='m-1'>
                                <CListGroup>
                                    {
                                        this.state.collections.map((item, index) => (
                                            <CListGroupItem onClick={this.changeActiveCollection.bind(this, item)} component="button">{item}</CListGroupItem>

                                        ))
                                    }
                                </CListGroup>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol md={9}>
                        <CCard className="mb-4">
                            <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>CollectionName : {this.state.activeCollection}</CCardHeader>
                            <CCardBody className='m-1'>
                                <CRow>
                                    <CCol sm={12} md={6}>
                                        <CForm>
                                            <CFormLabel htmlFor="contenttext">Content</CFormLabel>
                                        </CForm>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    {
                                        this.state.contentInputs.map((item, index) => (
                                            this.getContentSiblingInput(item, index)
                                        ))
                                    }
                                </CRow>
                                <CRow>
                                    <CCol md={12}>
                                        <CButton onClick={this.addNewContentSibling.bind(this)} color="dark" className='mt-1 mb-1'><CIcon icon={icon.cilPlus} size="l" />Add New Content Field</CButton>
                                    </CCol>
                                </CRow>
                                {/* <CListGroup>
                                {
                                    this.state.activeCollectionContent.map((item, index) => (
                                        <li className="list-group-item my-delete-list-group-item">
                                            <JSONEditor
                                                name={item.id}
                                                data={item.content}
                                                updateOnClickHandler={this.updateCollectionItemOnClickHandler.bind(this)}
                                            />
                                        </li>
                                    ))
                                }

                            </CListGroup> */}
                            </CCardBody>
                        </CCard>
                    </CCol>


                    <ToastContainer />
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
                                <pre className='code_void'>{"void "}<span className='code_void_name'>{"update_collection()"}</span><span>{"{\n"}</span></pre>

                                <pre className='px-5'>{"JSONObject sendObject=new JSONObject();\n" +
                                    "sendObject.put(\"id\",\"" + this.state.id + "\")\n" +
                                    "" + this.state.contentString
                                }
                                    <br />
                                    <span className='code_void'>{"new "}</span>{"PostGetBuilder()\n" +
                                        ".setActivity("}<span className='code_void'>this</span>{")\n" +
                                            ".setMethod(PostGet.REQUEST_METHODS."}<span className='property'>{"POST"}</span>{")\n" +
                                            ".setToken(token)\n"+
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
                                <pre><span className='import'>{"async "}</span><span className=''>{"updateCollectionOnClickHandler() {\n"}</span></pre>

                                <pre className='px-5'>
                                    <span className='import'>{"const "}</span>{"updateCollection = " + this.state.reactString + "\n\n"
                                    }
                                    <span className='await'>{"await "}</span>{"post(updateCollection, Methods." + this.state.react_method + ").then("}<span className='import'>{"function "}</span>{"(result) {\n" +
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
