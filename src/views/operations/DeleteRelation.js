import React, { Component } from 'react';
import { verify, login, Methods, post } from '../../api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import Popup from '../widgets/Popup';
import JSONPretty from 'react-json-prettify';
import { tomorrowNight as currentTheme } from 'react-json-prettify/dist/themes';
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
export class Delete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collections: [],
            activeCollection: null,
            activeCollectionContent: [],
            deleteModal: false,
            beingDeletedRelationID: null,
            beingDeletedRelationTO: null,
            contentString: "",
            activeKey: 1,
            method: "deleteRelation",
            react_method: "DeleteRelation",
            reactString: "{}"
        }
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
            "distinct": "relationName"
        }
        var col = null;
        await post(model, Methods.GetRelations).then(function (result) {
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
            "relationName": collection
        }
        await post(model, Methods.GetRelations).then(function (result) {
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
            this.setState({
                activeCollectionContent: col.values
            })
        } else {
            console.log(hata);
        }
    }

    
    chooseRelation(relationId) {
        this.setState({ beingDeletedRelationID: relationId });
        this.setCode(relationId)
    }
  

    toggleDeleteModal() {
        if (this.state.deleteModal) {
            this.setState({
                deleteModal: false,
                beingDeletedRelationID: null,
                beingDeletedRelationTO: null
            });
        } else {
            this.setState({
                deleteModal: true
            });
        }
    }
    setCode(id) {
        if (id != "") {
            var strd = "JSONArray delete_items = new JSONArray();\n"
            strd = strd.concat("delete_items.put(\"" + id + "\")\n")
            strd = strd.concat("sendObject.put(\"ids\",delete_items)\n")
            this.setState({ contentString: strd })
            const d={
                "ids":[
                    {
                        "id":id
                    }
                ]
            }
            this.props.onUpdateCollection(d)
        } else {
            this.setState({ contentString: "" })
        }
        this.setReact(id)
    }
    async setReact(id) {
        const c = {
            "ids": [id]
        }
        var sc = JSON.stringify(c, null, 4)
        if (sc === "null") {
          sc = "{}"
        }
        this.setState({ reactString: sc })
      }
    render() {
        return (
            <CContainer>
                <CRow xs={{ cols: 1 }} md={{ cols: 2 }}>
                    <CCol md={4}>
                        <CCard className="mb-4">
                            <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>Relation Names</CCardHeader>
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
                    <CCol md={8}>
                        <CCard className="mb-4">
                            <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>RelationName : {this.state.activeCollection}</CCardHeader>
                            <CCardBody className='m-1'>
                                <CListGroup>
                                    {
                                        this.state.activeCollectionContent.map((item, index) => (
                                            <li className="list-group-item my-delete-list-group-item pt-4 pb-4">
                                                <CContainer>
                                                    <CRow >
                                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                            <CButton color='secondary' size="sm" onClick={this.chooseRelation.bind(this, item._id)}>
                                                                <CIcon icon={icon.cilHandPointUp} size="xs" /> Choose Relation
                                                            </CButton>
                                                        </div>
                                                    </CRow>
                                                    <CRow>
                                                        <JSONPretty
                                                            json={item}
                                                            theme={currentTheme}
                                                        />
                                                    </CRow>

                                                </CContainer>


                                            </li>
                                        ))
                                    }

                                </CListGroup>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    

                    <ToastContainer />
                </CRow>
            </CContainer>
        )
    }
}
export default Delete