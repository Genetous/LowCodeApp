import React, { Component } from 'react';
import axios from 'axios';
import { CSVReader } from 'react-papaparse'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
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
    CNav,
    CNavItem,
    CNavLink,
    CTabPane,
    CTabContent,
    CContainer,
    CLink
} from '@coreui/react'
const buttonRef = React.createRef()
export class email_notification extends Component {
    handleOpenDialog = (e) => {
        // Note that the ref is set async, so it might be null at some point
        if (buttonRef.current) {
            buttonRef.current.open(e)
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
    handleOnFileLoad = (d) => {
        console.log('---------------------------')
        console.log(d)
        console.log('---------------------------')
        const data = JSON.parse(JSON.stringify(this.state.data));
        var list = []
        d.map((item, index) => (
            index > 0 &&
            item.data[0] != "" &&
            list.push(item.data[0])
        ));
        data.val.to = list;
        data.val.host = d[0].data[0];
        data.val.port = parseInt(d[0].data[1]);
        data.val.user = d[0].data[2];
        data.val.password = d[0].data[3];
        data.val.subject = d[0].data[4];
        data.val.content_type = d[0].data[5];
        this.setState({
            data,
            tostr: list
        });
        this.setCode(this.state.data.val, "contentString", true)
    }

    handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
    }

    handleOnRemoveFile = (d) => {
        console.log('---------------------------')
        console.log(d)
        console.log('---------------------------')
        const data = JSON.parse(JSON.stringify(this.state.data));
        data.val.to = [];
        data.val.to = [];
        data.val.host = "";
        data.val.port = "";
        data.val.user = "";
        data.val.password = "";
        data.val.subject = "";
        data.val.content_type = "html";
        this.setState({
            data,
            tostr: ""
        });
        this.setCode(this.state.data.val, "contentString", false)
    }

    handleRemoveFile = (e) => {
        // Note that the ref is set async, so it might be null at some point
        if (buttonRef.current) {
            buttonRef.current.removeFile(e)
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            data: {
                val: {
                    host: "",
                    port: 0,
                    user: "",
                    to: [],
                    password: "",
                    subject: "",
                    content_type: "html",
                    content: ""
                },
                type: "mail"
            },
            tostr: "",
            activeKey: 1,
            contentString: "",
            collectionString: "",
            method: "sendMail",
            react_method: "SendMail",
            reactString: "{}",
            iosString: "[]"
        }
    }
    async setCode(st, ctn, bind) {
        var strd = ""
        var uf = []

        if (bind) {
            strd = strd.concat("JSONObject sendObject = new JSONObject()\n")
            strd = strd.concat("JSONObject val = new JSONObject()\n")
            var item = st
            Object.keys(item).forEach(function (key) {
                var isJArray = Object.prototype.toString.call(item[key]) === '[object Array]'
                if (isJArray) {
                    strd = strd.concat("JSONArray j_" + String(key) + " = new JSONArray()\n")
                    var vc = item[key]
                    item[key].map((v, vv) => (
                        strd = strd.concat("j_" + String(key) + ".put(\"" + v + "\")\n")
                    ))
                    strd = strd.concat("val.put(\"" + key + "\",\"j_" + String(key) + ")\n")
                }
                else {
                    strd = strd.concat("val.put(\"" + key + "\",\"" + item[key] + "\")\n")
                }
            })
            strd = strd.concat("sendObject.put(\"type\",\"mail\")\n")
            strd = strd.concat("sendObject.put(\"val\",val)\n")
        }
        if (ctn === "contentString") {
            this.setState({ contentString: strd })
        }
        this.setReact(bind)
    }
    async setReact(bind) {
        if (bind) {
            var sc = JSON.stringify(this.state.data, null, 4)
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
        } else {
            this.setState({ reactString: "{}",iosString:"[]" })
        }
    }
    handleChange = date => {
        this.setState({
            startDate: date
        });
    };

    componentDidMount() {
        bsCustomFileInput.init()
    }
    componentDidMount() {
        axios.get(`https://jsonplaceholder.typicode.com/users`)
            .then(res => {
                const persons = res.data;
                this.setState({ persons });
            })
    }
    clear() {
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
        Array.from(document.querySelectorAll("select")).forEach(
            input => (input.value = "0")
        );
        Array.from(document.querySelectorAll("textarea")).forEach(
            input => (input.value = "")
        );
        this.setState({
            data: {
                val: {
                    host: "",
                    port: 0,
                    user: "",
                    to: [],
                    password: "",
                    subject: "",
                    content_type: "html",
                    content: ""
                },
                type: "mail"
            },
            tostr: ""
        });
    }
    textOnChange(e) {
        const data = JSON.parse(JSON.stringify(this.state.data));
        if (e.target.id === "port") {
            if (!Number(e.target.value)) {
                return;
            }
            data.val[e.target.id] = e.target.value
        } else if (e.target.id === "to") {
            var val = e.target.value
            if (val.indexOf(",") > 0) {
                var arr1 = val.split(",");
                var arr = [];
                for (var i = 0; i < arr1.length; ++i) {
                    if (arr1[i].trim() != "") {
                        arr.push(arr1[i]);
                    }
                }
                data.val[e.target.id] = arr;
            } else {
                var arr = [];
                arr.push(val);
                data.val[e.target.id] = arr;
            }
            this.setState({
                tostr: val
            });
        }
        else {
            data.val[e.target.id] = e.target.value;
        }
        this.setState({
            data,
        });
    }
    textOnChangeEditor(e) {
        const data = JSON.parse(JSON.stringify(this.state.data));
        data.val["content"] = e;

        this.setState({
            data
        });
    }
    



    render() {
        return (
            <CContainer>
                <ToastContainer />
                <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>E-mail Notification</CCardHeader>

                <CCard>
                    <CCardBody>
                        <CRow>
                            <CSVReader
                                onDrop={this.handleOnDrop}
                                onError={this.handleOnError}
                                onFileLoad={this.handleOnFileLoad}
                                addRemoveButton
                                onRemoveFile={this.handleOnRemoveFile}

                            >
                                <span>Drop a CSV file contains e-mail addresses here or click to upload.</span>
                            </CSVReader>
                        </CRow>
                        <CRow>
                            <CNav variant="tabs" role="tablist" className='mt-3'>
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
                                    <div>
                                        <CButton className='float-end' size='sm' color='secondary' onClick={this.copyText.bind(this, "android")}><CIcon icon={icon.cilCopy} size="xs" /> Copy</CButton>
                                        <CButton className='float-end mx-1' size='sm' component="a" href="./email_sample.csv" download="email_sample.csv" color='secondary'><CIcon icon={icon.cilCloudDownload} size="xs" />
                                            Download CSV Sample File</CButton>
                                    </div>
                                    <div id="android">
                                        <pre><span className='import'>{"import"}</span>{" com.mubo.genetous_http.PostGet;\n" +
                                            ""}<span className='import'>{"import"}</span>{" com.mubo.genetous_http.PostGetBuilder;\n" +
                                                ""}<span className='import'>{"import"}</span>{" com.mubo.genetous_http.response;\n" +
                                                    ""}<span className='import'>{"import"}</span>{" org.json.JSONObject\n\n"}
                                        </pre>
                                        <pre className='code_void'>{"void "}<span className='code_void_name'>{"send_mail()"}</span><span>{"{\n"}</span></pre>

                                        <pre className='px-5'>{
                                            this.state.contentString
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
                                    <div>
                                        <CButton className='float-end' size='sm' color='secondary' onClick={this.copyText.bind(this, "react")}><CIcon icon={icon.cilCopy} size="xs" /> Copy</CButton>
                                        <CButton className='float-end mx-1' size='sm' component="a" href="./sample.csv" download="sample.csv" color='secondary'><CIcon icon={icon.cilCloudDownload} size="xs" />
                                            Download CSV Sample File</CButton>
                                    </div>
                                    <div id="react">
                                        <pre><span className='code_void'>{"import"}</span>{" {Methods,post} "}<span className='code_void'>{"from "}</span>{"\"genetous_react\"\n\n"}</pre>
                                        <br />
                                        <pre><span className='import'>{"async "}</span><span className=''>{"sendMailOnClickHandler() {\n"}</span></pre>

                                        <pre className='px-5'>
                                            <span className='import'>{"const "}</span>{"model = " + this.state.reactString + "\n\n"
                                            }
                                            <span className='await'>{"await "}</span>{"post(model, Methods." + this.state.react_method + ").then("}<span className='import'>{"function "}</span>{"(result) {\n" +
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
                    </CCardBody>
                </CCard>
            </CContainer>



        );
    }
}
export default email_notification