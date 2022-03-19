import React, { Component } from 'react';
import { verify, login, Methods, post } from '../../api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import JSONPretty from 'react-json-prettify';
import { tomorrowNight as currentTheme } from 'react-json-prettify/dist/themes';
import { IterateiOS } from 'src/iterator';
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
export class add extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collection: {
                collectionName: "",
                content: {}
            },
            collectionInputs: [],
            contentInputs: [],
            activeKey: 1,
            contentString: "",
            collectionString: "",
            method: "addCollection",
            react_method: "AddCollection",
            reactString: "{}",
            iosString: "[]",
            
        }
    }
    convertType(type, value) {

        const response = {
            error: false,
            value: value
        }

        if (type === "String") {
            response.error = false;
            return response;
        } else if (type === "Integer") {
            response.value = Number(value);
            response.error = !Number.isInteger(response.value);
            return response;
        } else if (type === "Double") {
            const val = parseFloat(Number(value));
            response.error = isNaN(val);
            response.value = val;
            return response;
        } else if (type === "Boolean") {
            const val = value.trim();
            if (val.trim().toLowerCase() === "true" || val.trim().toLowerCase() === "false") {
                response.value = val.trim().toLowerCase() === "true" ? true : false;
                return response;
            } else {
                response.error = true;
                return response;
            }
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
    addNewCollectionSibling() {
        const { collectionInputs } = this.state;

        if (collectionInputs.filter(ci => ci.field === "").length == 0) {
            this.setState({
                collectionInputs: [...this.state.collectionInputs, { field: "", value: "", type: "String" }]
            })
        }
    }

    getCollectionSiblingInput(sibling, index) {
        return (
            <CRow className='collection-siblings mb-1 mt-1' key={index}>
                <CCol md={12}>
                    <CForm>
                        <CRow>
                            <CCol md={3}>
                                <CFormInput type="text" name="field" id={sibling.field} value={sibling.field} placeholder="Field" onChange={this.collectionSiblingOnChangeHandler.bind(this, index)} />
                            </CCol>
                            <CCol md={3}>
                                <CFormInput type="text" name="value" id={sibling.value} value={sibling.value} placeholder="Value" onChange={this.collectionSiblingOnChangeHandler.bind(this, index)} />
                            </CCol>
                            <CCol md={2}>
                                <CFormSelect aria-label="Default select example" value={sibling.type} onChange={this.collectionSiblingTypeChangeHandler.bind(this, index)}>
                                    <option name="type" value="String">String</option>
                                    <option name="type" value="Integer">Integer</option>
                                    <option name="type" value="Double">Double</option>
                                    <option name="type" value="Boolean">Boolean</option>
                                </CFormSelect>
                            </CCol>
                            <CCol md={3} className='d-flex justify-content-between'>
                                <CButton onClick={this.removeCollectionSibling.bind(this, index)} color="danger"><CIcon icon={icon.cilTrash} size="l" /></CButton>

                            </CCol>
                        </CRow>
                    </CForm>
                </CCol>
            </CRow>

        )
    }

    collectionSiblingTypeChangeHandler(index, e) {
        const { collectionInputs } = this.state;
        const collectionInputsCopy = [...collectionInputs];
        collectionInputsCopy[index].type = e.target.value;
        this.setState({
            collectionInputs: collectionInputsCopy
        });
    }

    collectionSiblingOnChangeHandler(index, e) {
        const { collectionInputs } = this.state;
        collectionInputs[index][e.target.name] = e.target.value;
        this.setState({
            collectionInputs
        });
        this.setCode(this.state.collectionInputs, "collectionString")
    }

    removeCollectionSibling(index) {
        const { collectionInputs } = this.state;
        const collectionInputsCopy = [...collectionInputs];
        collectionInputsCopy.splice(index, 1);
        this.setState({
            collectionInputs: collectionInputsCopy
        })
        this.setCode(this.state.collectionInputs, "collectionString")
    }

    addNewContentSibling() {
        const { contentInputs } = this.state;
        if (contentInputs.filter(ci => ci.field === "").length == 0) {
            this.setState({
                contentInputs: [...this.state.contentInputs, { field: "", value: "", type: "String", isUnique: false, isArray: false }]
            })
        }
    }

    getContentSiblingInput(sibling, index) {
        return (
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
                                <CFormCheck checked={sibling.isUnique} onChange={this.contentSiblingUniqueToggler.bind(this, index)} label="Unique" />
                                <CFormCheck checked={sibling.isArray} onChange={this.contentSiblingArrayToggler.bind(this, index)} label="Array" />
                            </CCol>
                        </CRow>
                    </CForm>
                </CCol>
            </CRow>


        )
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
    async setCode(st, ctn) {
        var strd = ""
        var arr = st
        var uf = []
        if (ctn === "contentString" && arr.length > 0) {
            strd = strd.concat("JSONObject content = new JSONObject();\n")
        }
        for (var i = 0; i < arr.length; ++i) {
            var item = arr[i]
            if ("isArray" in item && item.isArray == true) {
                strd = strd.concat("JSONArray j" + String(i) + " = new JSONArray();\n")
                item.value.split(",").map((v, vv) => (
                    strd = strd.concat("j" + String(i) + ".put(\"" + v + "\");\n")
                ))
                strd = strd.concat("content.put(\"" + item.field + "\",\"j" + String(i) + ");\n")
            }
            else {
                if (ctn === "contentString") {
                    strd = strd.concat("content.put(\"" + item.field + "\",\"" + item.value + "\");\n")
                } else {
                    strd = strd.concat("sendObject.put(\"" + item.field + "\",\"" + item.value + "\");\n")
                }
            }
            if (item.isUnique) {
                uf.push(item.field)
            }
        }
        if (ctn === "contentString" && arr.length > 0) {
            if (uf.length > 0) {
                strd = strd.concat("JSONArray j_uf = new JSONArray();\n")
                uf.map((v, vv) => (
                    strd = strd.concat("j_uf.put(\"" + v + "\");\n")
                ))
                strd = strd.concat("content.put(\"uniqueFields\",\"j_uf\");\n")
                this.setState({ method: "addUniqueCollection", react_method: "AddUniqueCollection" })
            } else {
                this.setState({ method: "addCollection", react_method: "AddCollection" })
            }
        }
        if (ctn === "contentString") {
            if (arr.length > 0)
                strd = strd.concat("sendObject.put(\"content\",content);\n")
            this.setState({ contentString: strd })
        }
        else {
            this.setState({ collectionString: strd })
        }
        this.setReact()
    }
    async setReact() {
        var c = null
        await this.getCollection().then(function (result) {
            c = result
        }, err => {

        });
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

    collectionNameOnChangeHandler(e) {
        const { collection } = this.state;
        collection.collectionName = e.target.value;
        this.setState({
            collection
        });
        this.setReact()
    }

   

    getCollection() {
        return new Promise((resolve, reject) => {
            const collection = JSON.parse(JSON.stringify(this.state.collection));
            const { collectionInputs, contentInputs } = this.state;

            if (collection.collectionName.trim() === "") {
                return reject("Collection name cannot be empty!");
            }

            for (let i = 0; i < collectionInputs.length; i++) {
                const { field, value, type } = collectionInputs[i];
                if (field.trim() === "" || value.trim() === "" || field.indexOf(' ') >= 0) {
                    return reject("Collection Inputs cannot be empty!")
                }
                if (field !== "collectionName" || field !== "content") {
                    const convertResponse = this.convertType(type, value);
                    if (convertResponse.error) {
                        return reject("Please fill Collection areas with correct data types!");
                    } else {
                        collection[field] = convertResponse.value;
                    }
                }

            }

            for (let i = 0; i < contentInputs.length; i++) {
                const { field, value, type, isUnique, isArray } = contentInputs[i];
                if (field.trim() === "" || type.trim() === "" || field.indexOf(' ') >= 0) {
                    return reject("Content Inputs cannot be empty!")
                }
                if (field !== "uniqueFields") {
                    if (!isArray) {
                        const convertResponse = this.convertType(type, value);
                        if (convertResponse.error) {
                            return reject("Please fill Content areas with correct data types!");
                        } else {
                            collection.content[field] = convertResponse.value;
                        }
                        if (isUnique) {
                            if (!collection.content.uniqueFields)
                                collection.content.uniqueFields = [];
                            collection.content.uniqueFields.push(field);
                        }
                    } else {
                        const arr = value.split(",");
                        console.log(arr);
                        const convertedArr = [];
                        for (let k = 0; k < arr.length; k++) {
                            const convertResponse = this.convertType(type, arr[k]);
                            if (convertResponse.error) {
                                return reject("Please fill Content areas with correct data types!");
                            } else {
                                convertedArr.push(convertResponse.value);
                            }
                        }
                        collection.content[field] = convertedArr;
                        if (isUnique) {
                            if (!collection.content.uniqueFields)
                                collection.content.uniqueFields = [];
                            collection.content.uniqueFields.push(field);
                        }
                    }
                }
            }

            return resolve(collection);
        })
    }

    render() {

        return (
            <CContainer>
                <CRow>
                    <CCard className="mb-4">
                        <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>Add Collection</CCardHeader>
                        <CCardBody className='m-1'>
                            <CRow>
                                <CCol sm={12} md={6}>
                                    <CForm>
                                        <CFormLabel htmlFor="collectionName">Collection Name</CFormLabel>
                                        <CFormInput type="text" id="collectionName" value={this.state.collection.collectionName} onChange={this.collectionNameOnChangeHandler.bind(this)} />
                                    </CForm>
                                </CCol>
                            </CRow>
                            <CRow>
                                {
                                    this.state.collectionInputs.map((item, index) => (
                                        this.getCollectionSiblingInput(item, index)
                                    ))
                                }
                            </CRow>
                            <CRow>
                                <CCol md={12}>
                                    <CButton onClick={this.addNewCollectionSibling.bind(this)} color="dark" className='mt-1 mb-1'><CIcon icon={icon.cilPlus} size="l" />Add New Field</CButton>
                                </CCol>
                            </CRow>
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
                            {/*  <CRow>
                                <CCol md={12} className="text-center">
                                    <CButton onClick={this.createCollectionOnClickHandler.bind(this)} color="dark" className='mt-1 mb-1 align-self-center'><CIcon className='me-2' icon={icon.cilLibraryAdd} size="l" />Add Collection</CButton>
                                </CCol>
                            </CRow> */}
                            <ToastContainer />
                        </CCardBody>
                    </CCard>
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
                                            ""}<span className='import'>{"import"}</span>{" org.json.JSONObject;\n\n"}
                                </pre>
                                <pre className='code_void'>{"void "}<span className='code_void_name'>{"add_collection()"}</span><span>{"{\n"}</span></pre>

                                <pre className='px-5'>{"JSONObject sendObject=new JSONObject();\n" +
                                    "sendObject.put(\"collectionName\",\"" + this.state.collection.collectionName + "\");\n" +
                                    "" + this.state.collectionString + "\n" +
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
                                <pre><span className='import'>{"async "}</span><span className=''>{"createCollectionOnClickHandler() {\n"}</span></pre>

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
export default add