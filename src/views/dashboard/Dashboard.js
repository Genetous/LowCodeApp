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
  CListGroup,
  CListGroupItem,
  CForm,
  CFormLabel,
  CFormTextarea,
  CFormInput,
  CProgressBar,
  CProgress,
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

import { verify, login, Methods, post, fileUpload, domain } from '../../api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { withRouter, Redirect } from 'react-router-dom'
export class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFiles: [],
      uploaded: false,
      content: "",
      receivers: "",
      subject: "",
      redirect: false,
      uploading: false,
      percent: 0,
      activeKey: 1,
      contentString: "",
      collectionString: "",
      method: "uploadFile",
      react_method: "FileUpload",
      reactString: "{}",
      handlePerc: ""

    };
    this.handlePercent = this.handlePercent.bind(this);
  }
  handlePercent(data) {
    this.setState({ percent: data })
  }

  setCode() {
    var strd = ""
    var arr = this.state.relation.contents
    var canEmpty = false
    if (this.state.relation.relations[0].id === "" && this.state.relation.relations[0].relationName === "") {
      canEmpty = true
    }
    if (!canEmpty) {
      strd = strd.concat("JSONObject sendObject = new JSONObject\n")
      strd = strd.concat("JSONArray relations = new JSONArray()\n")
      strd = strd.concat("JSONObject relation_item = new JSONObject()\n")
      strd = strd.concat("relation_item.put(\"relationName\",\"" + this.state.relation.relations[0].relationName + "\")\n")
      strd = strd.concat("relation_item.put(\"id\",\"" + this.state.relation.relations[0].id + "\")\n")
      strd = strd.concat("relations.put(\"relation_item\")\n")
      if (arr.length > 0)
        strd = strd.concat("JSONArray content_items = new JSONArray()\n")

      for (var i = 0; i < arr.length; ++i) {
        var item = arr[i]
        strd = strd.concat("JSONObject j" + String(i) + " = new JSONObject()\n")
        strd = strd.concat("j" + String(i) + ".put(\"id\",\"" + item.id + "\")\n")
        strd = strd.concat("content_items.put(\"j" + String(i) + ")\n")
      }
      strd = strd.concat("sendObject.put(\"relations\",\"relation_item\")\n")
      if (arr.length > 0)
        strd = strd.concat("sendObject.put(\"contents\",\"content_items\")\n")
      this.setState({ contentString: strd })
    } else {
      this.setState({ contentString: strd })
    }
    this.setReact()
  }
  async setReact() {
    var hp = "<span className='import'> constructor</span>(props) {\n\
      super(props); \n\
      this.state = { \n\
        selectedFile:null \n\
      }\n\
      this.handlePercent = this.handlePercent.bind(this);\n\
    }";

    var sc = JSON.stringify(this.state.relation, null, 4)
    if (sc === "null") {
      sc = "{}"
    }
    this.setState({ reactString: sc, handlePerc: hp })
  }
  onDrop(files) {
    if (files.length > 0) {
      this.setState({
        selectedFiles: files
      });
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
  async upload(e) {
    var onay = false
    var hata = ""
    var res = ""
    var file = this.state.selectedFiles[0]
    if (file.name.indexOf(" ") > 0) {
      toast.error("File name must not contain spaces", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    this.setState({ uploading: true })
    const headerModel = {
      headers: {

      }, onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        this.setState({ percent: percentCompleted })
      }.bind(this),
      timeout: 200000
    }
    await fileUpload(file, Methods.FileUpload, this.handlePercent).then(function (result) {
      onay = true
      res = Methods.DownloadFile + result
    }, err => {
      try {
        hata = err.response.data
      } catch {
        hata = err.message
      }
    });
    if (onay) {
      toast.success("File Url Created", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      var data = this.state.content
      data += "<p><a href=" + res + ">" + this.state.selectedFiles[0].name + "</a></p>"
      this.setState({ uploaded: true, selectedFiles: [], content: data })


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
    this.setState({ uploading: false, percent: 0 })
  }
  handleEditorChange(data) {
    this.setState({ content: data })
  }
  clear(e) {
    this.setState({ uploaded: false, selectedFiles: [], content: "", receivers: "", subject: "" })
  }
  changeStateFormData(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
 
  async componentDidMount() {
    var res = await verify()
    if (!res) {
      this.setState({ redirect: true })
      localStorage.setItem('token', "")
    }
    const t = `${localStorage.getItem('token')}`
    if (t == 'null' || t == "") {
      this.setState({ redirect: true })
    }
    this.setReact()
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
          {/*  <CRow>
            <CCol sm={12}>
              <Dropzone onDrop={this.onDrop.bind(this)}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                  </section>
                )}
              </Dropzone>
              <CListGroup>
                {this.state.selectedFiles.map((item, index) =>
                  <CListGroupItem>{item.name}</CListGroupItem>
                )}

              </CListGroup>
              {this.state.uploading == true &&
                <CProgress className="mb-3">
                  <CProgressBar value={this.state.percent}>{this.state.percent}%</CProgressBar>
                </CProgress>
              }
              {this.state.selectedFiles.length > 0 &&

                <CButton color="primary" className='mt-2' onClick={this.upload.bind(this)}>Upload</CButton>
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
                    <CButton color="dark" onClick={this.send.bind(this)}>Send</CButton>
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
                  <pre className='code_void'>{"void "}<span className='code_void_name'>{"uploadFile(File f)"}</span><span>{"{\n"}</span></pre>

                  <pre className='px-5'>
                    <br />
                    <span className='code_void'>{"new "}</span>{"PostGetBuilder()\n" +
                      ".setActivity("}<span className='code_void'>this</span>{")\n" +
                        ".setPost_type(PostGet.POST_TYPE."}<span className='property'>{"MULTIPART"}</span>{")\n" +
                          ".setMethod(PostGet.REQUEST_METHODS."}<span className='property'>{"POST"}</span>{")\n" +
                            ".setPostFile(f)\n" +
                            ".setReturn_type(PostGet.RETURN_TYPE."}<span className='property'>{"STRING"}</span>{")\n" +
                              ".setHost("}<span className='str_text'>ip</span>{")\n" +
                                ".setUrlType(PostGet.URL_TYPE."}<span className='property'>{this.state.method}</span>{")\n" +
                                  ".setCompletionHandler("}<span className='code_void'>{"new "}</span>{"PostGet.completionHandler() {\n" +
                                    "    "}<span className='override'>@Override</span>{"\n" +
                                      "    "}<span className='code_void'>public void </span><span className='code_void_name'>onHttpFinished</span>{"(response response) {\n" +
                                        "         String url=response.getData();\n" +
                                        "         //Use Url\n" +
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
                  <pre><span className='ios_red'>{"import"}</span><span className='ios_purple'>{" genetousSDK "}</span>{"\n\n"}</pre>
                  <pre><span className='ios_red'>class</span> ViewController: <span className='ios_purple'>UIViewController,uploadProgress</span>{" {"}</pre>
                  <pre>{<span className='ios_red px-2'>let</span>}{" postGetBuilder = "}<span className='ios_blue'>{"PostGetBuilder"}</span>()</pre><br />
                  <pre className='px-2'><span className='ios_red'>{"func "}</span><span className=''>{"progress(uploadProgress: Float) {\n"}</span></pre>
                  <pre className='px-2'><span>{"  DispatchQueue.main.async {\n"}</span>
                      <span>    print</span>(<span className='ios_blue'>uploadProgress</span>){"\n"}
                      <span>{"  }\n"}</span>
                      <span>{"}\n"}</span>
                  </pre>
                  <pre className='px-2'><span className='ios_red'>{"func "}</span><span className=''>{"uploadFile(_ src:String) {\n"}</span></pre>

                  <pre className='px-5'>
                    <span className='ios_red'>{"let "}</span>{"parameters:"}[<span className='ios_red'>{"Any"}</span>]<span> = [{"\n"}</span>
                    <span> [{"\n"}</span>
                    <span className='ios_red'>{'  "key": "bucket",\n  "value": "your applicationId",\n  "type": "text"\n'}</span>
                    <span> ]]{"\n\n"}</span>
                   
                    <br />
                    {"postGetBuilder\n"}
                      <span className='ios_blue'>{".setParameters("}</span>parameters{")\n"}
                      <span className='ios_blue'>{".setPost_type"}</span>(POST_TYPE.MULTIPART){"\n"}
                      <span className='ios_blue'>{".setMethod"}</span>(REQUEST_METHODS.POST){"\n"}
                      <span className='ios_blue'>{".setPostFile"}</span>(src){"\n"}
                      <span className='ios_blue'>{".setReturn_type"}</span>(RETURN_TYPE.STRING){"\n"}
                      <span className='ios_blue'>{".setHost"}</span>(<span className='str_text'>ip</span>){"\n"}
                      <span className='ios_blue'>{".setUrlType"}</span>(URL_TYPE.{this.state.method}.description{")\n"}
                      <span className='ios_blue'>{".setDelegate"}</span>(<span className='ios_red'>self</span>){"\n"}
                      <span className='ios_blue'>{".setToken"}</span>(token){"\n"}
                     
                      <span className='ios_blue'>{".createPost"}</span>(){"\n"}
                      <span className='ios_blue'>{".process"}</span>(){"{response "}<span className='ios_red'>in</span>{"\n"}
                      <span>{"  DispatchQueue.main.async {\n"}</span>
                      <span className='ios_red'>    let </span>download_url:<span className='ios_blue'>String</span> = response?.Data{"\n"}
                      <span>{"  }\n"}</span>
                      <span>{"}\n"}</span>
                    
                  
                  </pre>
                  <pre className='px-2'>{"}"}</pre>
                  <pre className=''>{"}"}</pre>
                </div>
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={this.state.activeKey === 3}>
                <div><CButton className='float-end' size='sm' color='secondary' onClick={this.copyText.bind(this, "react")}><CIcon icon={icon.cilCopy} size="xs" /> Copy</CButton></div>
                <div id="react">
                  <pre><span className='code_void'>{"import"}</span>{" {Methods,fileUpload} "}<span className='code_void'>{"from "}</span>{"\"genetous_react\"\n\n"}</pre>
                  <pre>{<span className='import'>constructor</span>}{"(props) {\n" +
                    "   super(props); \n" +
                    "   this.state = { \n" +
                    "     selectedFile:null \n" +
                    "   }\n" +
                    "   this.handlePercent = this.handlePercent.bind(this);\n" +
                    " };\n" +
                    " handlePercent(data){\n" +
                    "   this.setState({ percent: data })\n" +
                    " }"}</pre><br />
                  <pre><span className='import'>{"async "}</span><span className=''>{"uploadFileOnClickHandler() {\n"}</span></pre>

                  <pre className='px-5'>
                    <span className='import'>{"var  "}</span>{"file = this.state.selectedFile\n\n"
                    }
                    <span className='await'>{"await "}</span>{"fileUpload(file, Methods." + this.state.react_method + ", handlePercent).then("}<span className='import'>{"function "}</span>{"(result) {\n" +
                      "   //result as string url\n" +
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

export default Upload
