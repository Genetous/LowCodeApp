import React, { lazy, Component } from 'react'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import {
    CAvatar,
    CButton,
    CCard,
    CCardBody,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CListGroup,
    CListGroupItem,
    CForm,
    CFormLabel,
    CFormTextarea,
    CFormInput,
    CLink,
    CNav,
    CNavItem,
    CNavLink,
    CTabPane,
    CTabContent
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import {
    cibCcAmex,
    cibCcApplePay,
    cibCcMastercard,
    cibCcPaypal,
    cibCcStripe,
    cibCcVisa,
    cibGoogle,
    cibFacebook,
    cibLinkedin,
    cifBr,
    cifEs,
    cifFr,
    cifIn,
    cifPl,
    cifUs,
    cibTwitter,
    cilCloudDownload,
    cilPeople,
    cilUser,
    cilUserFemale,
} from '@coreui/icons'

import { verify, login, Methods, post, fileUpload, domain, organization } from '../../api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { withRouter, Redirect } from 'react-router-dom'
export class Getlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFiles: [],
            uploaded: false,
            content: "",
            receivers: "",
            subject: "",
            filelist: [],
            fields: [],
            show: true,
            redirect: false,
            activeKey: 1,
            contentString: "",
            collectionString: "",
            method: "getFileList",
            react_method: "GetFileList",
            reactString: "{}",
            iosString:'[\n  "applicationId": "your application_id"\n]\n\n'
        };
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
    async componentDidMount() {
        var redirect = false
        var res = await verify()
        if (!res) {
            this.setState({ redirect: true })
            localStorage.setItem('token', "")
            redirect = true
        }
        const t = `${localStorage.getItem('token')}`
        if (t == 'null' || t == "") {
            redirect = true
            this.setState({ redirect: true })
        }
        if (!redirect)
            this.getlist();
        this.setCode();
    }
    onDrop(files) {
        if (files.length > 0) {
            this.setState({
                selectedFiles: files
            });
        }
    }
    async getlist() {
        var onay = false
        var hata = ""
        var res = null
        var model = {
            "applicationId": organization.application_id
        }
        await post(model, Methods.GetFileList).then(function (result) {
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
            var f = ["File", "Date", "", "", ""]
            for (var i = 0; i < res["values"].length; ++i) {
                var datestr = res["values"][i]["date"].split(" ")[0].split("/")
                console.log(datestr)
                var timestr = res["values"][i]["date"].split(" ")[1]
                console.log(timestr)
                var nDatestr = datestr[2] + "-" + datestr[1] + "-" + datestr[0] + " "
                console.log(nDatestr)
                var d = nDatestr + timestr
                console.log(d)
                var date = Date.parse(d);
                console.log(date)
                res["values"][i]["date"] = date
            }
            res["values"].sort(function (a, b) {
                return b.date - a.date;
            });
            this.setState({ filelist: res["values"], fields: f })
        } else {
            toast.error(hata, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }
    convertToDatetime(d) {
        if (d == 0) {
            return ""
        } else {
            var a = new Date(d);
            var minutes = a.getTimezoneOffset();
            a = new Date(a.getTime() - minutes * 60000);
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var m = a.getMonth() + 1
            var year = a.getFullYear();
            var month = m < 10 ? "0" + m : m;
            var date = a.getDate() < 10 ? "0" + a.getDate() : a.getDate();
            var hour = a.getHours() < 10 ? "0" + a.getHours() : a.getHours()
            var min = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes();
            var sec = a.getSeconds() < 10 ? "0" + a.getSeconds() : a.getSeconds();
            var time = date + '.' + month + '.' + year + ' ' + hour + ':' + min;
            return time;
        }
    }
    handleEditorChange(data) {
        this.setState({ content: data })
    }
    clear(e) {
        this.setState({ uploaded: false, show: true, content: "", receivers: "", subject: "" })
    }
    send(e) {

        var data = this.state.content
        var c = "<p><a href=" + Methods.DownloadFile + "download/file?filename=" + e + "&bucket=" + organization.application_id + ">" + e + "</a></p>"
        if (data.indexOf(c) < 1) {
            data += c
        }
        this.setState({ uploaded: true, show: false, content: data })

    }

    changeStateFormData(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    setCode() {
        var strd = ""
        strd = strd.concat("JSONObject sendObject = new JSONObject();\n")
        strd = strd.concat("sendObject.put(\"applicationId\",\"your applicationId\");\n")
        this.setState({ contentString: strd })
    }
    render() {
        const { redirect, error } = this.state;

        if (redirect) {
            return <Redirect to='/login' />;
        }
        return (


            <CCard className="mb-4">
                <CCardBody>
                    <ToastContainer />
                    {/*   <CRow>
                        <CCol sm={12}>
                            {this.state.show == true &&
                                <CTable responsive>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                            {this.state.fields.map((item, index) =>
                                                <CTableHeaderCell scope="col">{item}</CTableHeaderCell>
                                            )}
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {this.state.filelist.map((item, index) =>
                                            <CTableRow>
                                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                <CTableDataCell>{item[this.state.fields[0].toLowerCase()]}</CTableDataCell>
                                                <CTableDataCell>{this.convertToDatetime(item[this.state.fields[1].toLowerCase()])}</CTableDataCell>
                                                <CTableDataCell><CButton color="dark" onClick={this.send.bind(this, item[this.state.fields[0].toLowerCase()])} name={item[this.state.fields[0].toLowerCase()]}>Send</CButton></CTableDataCell>
                                                <CTableDataCell><CButton color="danger" onClick={this.delete.bind(this, item[this.state.fields[0].toLowerCase()])} name={item[this.state.fields[0].toLowerCase()]}>Delete</CButton></CTableDataCell>
                                                <CTableDataCell><CLink href={Methods.DownloadFile + "download/file?filename=" + item[this.state.fields[0].toLowerCase()] + "&bucket=" + organization.application_id} target="_blank">Download</CLink></CTableDataCell>

                                            </CTableRow>
                                        )}
                                    </CTableBody>
                                </CTable>
                            }
                            {this.state.uploaded == true &&
                                <CForm className='mt-2'>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="exampleFormControlInput1">Email addresses</CFormLabel>
                                        <CFormInput type="email" id="exampleFormControlInput1" onChange={this.changeStateFormData.bind(this)} name="receivers" placeholder="name@example.com" />
                                    </div>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="subject">Subject</CFormLabel>
                                        <CFormInput type="text" id="subject" onChange={this.changeStateFormData.bind(this)} name="subject" placeholder="Subject" />
                                    </div>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="exampleFormControlTextarea1">Content</CFormLabel>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={this.state.content || ''}
                                            onReady={editor => {
                                                // You can store the "editor" and use when it is needed.
                                                console.log('Editor is ready to use!', editor);
                                            }}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                this.handleEditorChange(data)
                                            }}
                                            onBlur={(event, editor) => {
                                                console.log('Blur.', editor);
                                            }}
                                            onFocus={(event, editor) => {
                                                console.log('Focus.', editor);
                                            }}
                                        />
                                    </div>
                                    <div className="d-grid gap-2  d-md-flex justify-content-md-center mt-2">
                                        <CButton color="dark" onClick={this.sendto.bind(this)}>Send</CButton>
                                        <CButton color="danger" onClick={this.clear.bind(this)}>Clear </CButton>
                                    </div>
                                </CForm>
                            }
                        </CCol>

                    </CRow> */}
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
                                    <pre className='code_void'>{"void "}<span className='code_void_name'>{"get_fileList()"}</span><span>{"{\n"}</span></pre>

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
                                <div><CButton className='float-end' size='sm' color='secondary' onClick={this.copyText.bind(this, "react")}><CIcon icon={icon.cilCopy} size="xs" /> Copy</CButton></div>
                                <div id="react">
                                    <pre><span className='code_void'>{"import"}</span>{" {Methods, post, organization} "}<span className='code_void'>{"from "}</span>{"\"genetous_react\"\n\n"}</pre>

                                    <pre><span className='import'>{"async "}</span><span className=''>{"getFileListOnClickHandler() {\n"}</span></pre>

                                    <pre className='px-5'>
                                        <span className='import'>{"const  "}</span>{"model = {\n" +
                                            "   \"applicationId\": organization.application_id\n" +
                                            "}\n\n"
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

        )
    }
}

export default Getlist
