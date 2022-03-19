import React, { Component } from 'react'
import axios from 'axios';
import JSONEditor from '../widgets/JSONEditor/JSONEditor';
import { verify, login, Methods, post } from '../../api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
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
      reactString: "{}"
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
    st.map((item, index) => {
      var arr = ["type", "isUnique", "isArray"]
      arr.map((v) => {
        if (v in item) {
          delete item[v];
        }
      })
    })
   this.props.onUpdateCollection(st)
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

              </CCardBody>
            </CCard>
          </CCol>


          <ToastContainer />
        </CRow>
      </CContainer>

    )
  }
}
