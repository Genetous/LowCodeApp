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
import { IterateiOS } from 'src/iterator';
export class DBJob extends Component {

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
            queries: [],
            queryInputs: [],
            activeStep: 0,
            fields: [],
            moment: moment(),
            contentString: "",
            activeKey: 1,
            method: "sendDBJob",
            react_method: "SendDBJob",
            reactString: "{}",
            shownURLReact: "",
            collectionSend: {
                endpoint: "",
                data: {
                },
                when: 0,
                result_type: "email",
                result_address: "your email address"
            },
            MethodType: {},
            contentString: "",
            collectionString: "",
            reactString: "{}",
            iosString:"[]"

        }
    }
    async onUpdateCollection(collection) {
        var collectionSend = { ...this.state.collectionSend }
        collectionSend.data = collection
        await this.setState({ collectionSend })
        this.setCode(this.state.collectionSend, "contentString")
    }
    componentDidMount() {
        //this.setCode(this.state.fcollectionSend, "contentString")
    }
    handleChange = async (moment) => {
        var date = Math.round(new Date(moment).getTime() / (1000 * 60)) * 60;
        var collectionSend = { ...this.state.collectionSend }
        collectionSend.when = parseInt(date);
        await this.setState({
            moment,
            collectionSend
        });
        this.setCode(this.state.collectionSend, "contentString")
    }
    nextStep() {
        var n = this.state.activeStep
        n++
        this.setState({ activeStep: n })
        this.setCode(this.state.collectionSend, "contentString")
    }
    getContent() {
        switch (this.state.MethodType.method) {
            case "AddCollection":
                return (<AddCollection
                    onUpdateCollection={this.onUpdateCollection.bind(this)}
                />)
            case "AddRelation":
                return (<AddRelation
                    onUpdateCollection={this.onUpdateCollection.bind(this)}
                />)
            case "UpdateCollection":
                return (<UpdateCollection
                    onUpdateCollection={this.onUpdateCollection.bind(this)}
                />)
            case "DeleteCollection":
                return (<DeleteCollection
                    onUpdateCollection={this.onUpdateCollection.bind(this)}
                />)
            case "DeleteRelation":
                return (<DeleteRelation
                    onUpdateCollection={this.onUpdateCollection.bind(this)}
                />)
        }
    }
    prevStep() {
        var n = this.state.activeStep
        if (n > 0)
            n--
        this.setState({ activeStep: n })
    }
    async getFields() {
        var onay = false
        var hata = ""
        var res = ""
        const { queryInputs } = this.state
        var c = {}
        queryInputs.map((item, index) => {
            c[item.field] = item.value
        })
        var collectionSend = { ...this.state.collectionSend }
        collectionSend.data = c;
        await this.setState({ collectionSend })
        this.setCode(this.state.collectionSend, "contentString")
        await post(c, this.state.collectionSend.endpoint).then(function (result) {
            onay = true
            res = result
        }, err => {
            try {
                hata = err.response.data
            } catch {
                hata = err.message
            }
        });
        if (onay) {
            var arr = []
            var c_arr = []
            if (res.values.length > 0)
                c_arr.push(res.values[0])
            else {
                toast.error("No Result Found", {
                    position: "bottom-right",
                    autoClose: 1200,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                this.prevStep()
                return
            }
            var val = this.convertJsonToDot(res.values[0], [], [])
            Object.keys(val).map((item, index) => {
                arr.push(item)
            });
            this.setState({ fields: arr, activeSelectedCollectionContent: c_arr })
        } else {
            this.setState({ fields: [], activeSelectedCollectionContent: [] })
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
    addNewQueryInputs() {
        const { queryInputs } = this.state;
        var val = this.convertJsonToDot(this.state.activeCollectionContent[0], [], [])
        var count = 0

        var contains = queryInputs.some((item, index) => {
            if (val.hasOwnProperty(item.field)) {
                count++
                if (count > 1) {
                    return true;
                }
            }

        })
        if (contains) {
            toast.error("Key Exists", {
                position: "bottom-right",
                autoClose: 1200,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            if (queryInputs.filter(ci => ci.field === "").length == 0) {
                this.setState({
                    queryInputs: [...this.state.queryInputs, { field: "", value: "" }]
                })
            }
        }
    }
    getQueyField(sibling, index) {
        return (<CRow className='mt-2'>
            <CCol sm={12} md={6} lg={5} >
                <CFormInput type="text" name="field" id={sibling.field} value={sibling.field} placeholder="Field" onChange={this.querySiblingOnChangeHandler.bind(this, index)} />
            </CCol>
            <CCol sm={12} md={6} lg={5}>
                <CFormInput type="text" name="value" id={sibling.value} value={sibling.value} placeholder="Key" onChange={this.querySiblingOnChangeHandler.bind(this, index)} />
            </CCol>
            <CCol sm={12} md={6} lg={2}>
                <CButton type="text" name="button" id={index} onClick={this.removeQuerySibling.bind(this, index)}><CIcon icon={icon.cilTrash} /></CButton>
            </CCol>
        </CRow>)
    }
    querySiblingOnChangeHandler(index, e) {
        const { queryInputs } = this.state;
        queryInputs[index][e.target.name] = e.target.value;
        this.setState({
            queryInputs
        });
    }

    async removeQuerySibling(index) {
        const { queryInputs } = this.state;
        const queryInputsCopy = [...queryInputs];
        queryInputsCopy.splice(index, 1);
        await this.setState({
            queryInputs: queryInputsCopy
        })

    }
    async addQuery(field, value) {
        var data = {}
        data[field] = value
        var arr = this.state.queries
        let isKeyPresent = arr.some(el => {
            if (el.hasOwnProperty(field))
                return true;
        })
        if (!isKeyPresent) {
            arr.push(data)
            await this.setState({ queries: arr })
        } else {
            toast.error("Key Exists", {
                position: "bottom-right",
                autoClose: 1200,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }
    async collectionTypeChanged(collection) {
        var onay = false
        var hata = ""
        var res = ""
        var aType = collection.type
        var method = collection.type == "Collection" ? Methods.GetCollections : Methods.GetRelations
        const model = {
            "distinct": collection.type == "Collection" ? "collectionName" : "relationName"
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
                activeType: aType
            });
            this.getCollectionContentRequest(col.values[0], collection);
        } else {
            console.log(hata);
        }
    }
    async nameChanged(e) {
        this.getCollectionContentRequest(e.target.value);
    }
    async epChanged(e) {
        var ep = parseInt(e.target.value)

        var collectionSend = { ...this.state.collectionSend }
        collectionSend.endpoint = MethodTypes[ep].url;
        await this.setState({ collectionSend, MethodType: MethodTypes[ep] })
    }
    async getCollectionContentRequest(collection, mType) {
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
        if (onay) {
            var arr = [col.values[0]]
            this.setState({
                activeCollectionContent: arr
            })
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
    handleOnFileLoad = async (d) => {
        console.log('---------------------------')
        console.log(d)
        console.log('---------------------------')
        var collectionSend = { ...this.state.collectionSend }
        var list = []
        d.map((item, index) => (
            index > 0 &&
            item.data[0] != "" &&
            list.push(item.data[0])
        ));
        collectionSend.withResult.job_settings.auth_key = d[0].data[0];
        collectionSend.withResult.job_settings.content = "<p>your notification content(you can use field in result between %% tags like %content.username%)</p>";
        collectionSend.withResult.job_settings.title = d[2].data[0];
        collectionSend.withResult.job_settings.topic = d[3].data[0];
        collectionSend.withResult.job_settings.image = d[4].data[0];
        await this.setState({
            collectionSend
        });
        this.setCode(this.state.collectionSend, "contentString", true)
    }

    handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
    }

    handleOnRemoveFile = (d) => {
        console.log('---------------------------')
        console.log(d)
        console.log('---------------------------')
        var collectionSend = { ...this.state.collectionSend }
        collectionSend.withResult.job_settings.to = [];
        collectionSend.withResult.job_settings.host = "";
        collectionSend.withResult.job_settings.port = "";
        collectionSend.withResult.job_settings.user = "";
        collectionSend.withResult.job_settings.password = "";
        collectionSend.withResult.job_settings.subject = "";
        collectionSend.withResult.job_settings.content_type = "html";
        this.setState({
            collectionSend
        });
        this.setCode(this.state.collectionSend, "contentString", false)
    }
    checkChanged(val, e) {
        var checked = e.target.checked
        var collectionSend = { ...this.state.collectionSend }
        var arr = this.state.collectionSend.withResult.fields
        if (checked) {
            arr.push(val)
            collectionSend.withResult.fields = arr
            this.setState({ collectionSend })
        } else {
            const index = arr.indexOf(val);
            if (index > -1) {
                arr.splice(index, 1);
                collectionSend.withResult.fields = arr
                this.setState({ collectionSend })
            }
        }
        this.setCode(this.state.collectionSend, "contentString", false)
    }



    async setCode(st, ctn) {
        var strd = ""
        var item = st
        strd = await this.Iterate(item, strd, "sendObject", 0, "")
        if (ctn === "contentString") {
            this.setState({ contentString: strd })
        }

        this.setReact()
    }
    async Iterate(item, strd, keyval, counter, jname) {
        counter++
        for (var i = 0; i < Object.keys(item).length; ++i) {
            var key = Object.keys(item)[i]
            var isJArray = Object.prototype.toString.call(item[key]) === '[object Array]'
            var isObject = Object.prototype.toString.call(item[key]) === '[object Object]'
            if (isJArray) {
                var jn = "j_" + String(key) + "_" + String(counter)
                strd = strd.concat("JSONArray j_" + String(key) + "_" + String(counter) + " = new JSONArray();\n")
                var vc = item[key]
                for (var c = 0; c < vc.length; ++c) {

                    var el = vc[c]
                    var isObjectA = Object.prototype.toString.call(el) === '[object Object]'
                    var isJArrayA = Object.prototype.toString.call(el) === '[object Array]'
                    if (isObjectA) {
                        counter++
                        strd = strd.concat("JSONObject jo_" + String(key) + "_" + String(counter) + " = new JSONObject();\n")
                        var s = await this.Iterate(el, "", "jo_" + String(key) + "_" + String(counter), counter, jn)
                        strd = strd.concat(s)
                        strd = strd.concat(jn + ".put(jo_" + String(key) + "_" + String(counter) + ");\n")
                    } else if (isJArrayA) {
                        strd = strd.concat("JSONArray ja_" + String(key) + "_" + String(counter) + " = new JSONArray();\n")
                        var s = await this.Iterate(el, "", "ja_" + String(key) + "_" + String(counter), counter, jn)
                        strd = strd.concat(s)
                        strd = strd.concat(keyval + ".put(\"" + key + "\"," + key + ");\n")
                    } else {
                        strd = strd.concat("j_" + String(key) + "_" + String(counter) + ".put(\"" + el + "\");\n")
                    }
                }
                strd = strd.concat(keyval + ".put(\"" + key + "\"," + jn + ");\n")
            } else if (isObject) {
                strd = strd.concat("JSONObject " + String(key) + " = new JSONObject();\n")
                var s = await this.Iterate(item[key], "", key, counter, "")
                strd = strd.concat(s)
                strd = strd.concat(keyval + ".put(\"" + key + "\"," + key + ");\n")
                console.log(s)

            }
            else {
                var k = ""
                if (key == "endpoint") {
                    k = "PostGet.URL_TYPE." + this.state.MethodType.mobileMethod
                    var r = "Methods." + this.state.MethodType.method
                    this.setState({ shownURLReact: r })

                    if (await this.isString(item[key]))
                        strd = strd.concat(keyval + ".put(\"" + key + "\"," + k + ");\n")
                    else
                        strd = strd.concat(keyval + ".put(\"" + key + "\"," + k + ");\n")
                } else {
                    if (await this.isString(item[key]))
                        strd = strd.concat(keyval + ".put(\"" + key + "\",\"" + item[key] + "\");\n")
                    else
                        strd = strd.concat(keyval + ".put(\"" + key + "\"," + item[key] + ");\n")
                }

            }
        }
        return strd
    }
    async isString(value) {
        return typeof value === 'string' || value instanceof String;
    }
    async setReact() {
        var js = this.state.collectionSend
        var ep = js.endpoint
        var sc = JSON.stringify(js, null, 4)
        if (sc === "null") {
            sc = "{}"
        } else {
            sc = sc.replace("\"" + ep + "\"", this.state.shownURLReact)
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
                <Stepper
                    steps={[{ label: 'Choose Data' }, { label: 'Choose Result Items' }, { label: 'Pick Date' }]}
                    activeStep={this.state.activeStep}
                />

                <CRow className={this.state.activeStep == 0 ? "" : "visually-hidden"}>
                    <CCol>


                        <CCard className="mb-4">
                            <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>Choose Data</CCardHeader>
                            <CCardBody className='m-1 d-flex justify-content-center'>

                                <CCol sm={12} md={6}>
                                    <CFormSelect onChange={this.epChanged.bind(this)} as="select" className="mx-1 mb-3">
                                        <option name="type" value="">Choose EndPoint</option>
                                        {
                                            MethodTypes.map((item, index) => (
                                                <option name="type" value={index}>{item.method}</option>
                                            ))
                                        }
                                    </CFormSelect>
                                </CCol>

                                <ToastContainer />
                            </CCardBody>
                        </CCard>

                    </CCol>

                    <div className='d-flex flex-row-reverse'>
                        <CButton size='sm' className="m-2" onClick={this.nextStep.bind(this)}>Next Step</CButton>
                    </div>
                </CRow>
                <CRow className={this.state.activeStep == 1 ? "" : "visually-hidden"}>
                    <CCol md={6} lg={12}>
                        <CRow>
                            {
                                this.getContent()
                            }
                        </CRow>
                    </CCol>
                    <div className='d-flex flex-row-reverse'>
                        <CButton size='sm' className="m-2" onClick={this.nextStep.bind(this)}>Next Step</CButton>
                        <CButton size='sm' className="m-2" onClick={this.prevStep.bind(this)}>Previous Step</CButton>
                    </div>
                </CRow>
                <CRow className={this.state.activeStep == 2 ? "" : "visually-hidden"}>
                    <CCol md={12} lg={12}>

                        <CRow>
                            <CCard className="mb-4">
                                <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>Pick Date</CCardHeader>
                                <CCardBody className='m-1'>
                                    <CRow>
                                        <CCol sm={12} md={12} className='d-flex justify-content-center'>
                                            <DatetimePicker
                                                moment={this.state.moment}
                                                onChange={this.handleChange}
                                            />
                                        </CCol>
                                    </CRow>

                                </CCardBody>
                            </CCard>
                        </CRow>
                    </CCol>

                    <div className='d-flex flex-row-reverse'>
                        <CButton size='sm' className="m-2" onClick={this.prevStep.bind(this)}>Previous Step</CButton>
                    </div>
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
                                <pre className='code_void'>{"void "}<span className='code_void_name'>{"addDBJob()"}</span><span>{"{\n"}</span></pre>

                                <pre className='px-5'>{"JSONObject sendObject=new JSONObject();\n" +
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
                            <div><CButton className='float-end' size='sm' color='secondary' onClick={this.copyText.bind(this, "react")}><CIcon icon={cilCopy} size="xs" /> Copy</CButton></div>
                            <div id="react">
                                <pre><span className='code_void'>{"import"}</span>{" {Methods,post} "}<span className='code_void'>{"from "}</span>{"\"genetous_react\"\n\n"}</pre>
                                <pre><span className='import'>{"async "}</span><span className=''>{"createDBJobOnClickHandler() {\n"}</span></pre>

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
export default DBJob