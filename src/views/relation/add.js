import React, { Component } from 'react';
import axios from 'axios';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import { Form } from 'react-bootstrap';
import JSONPretty from 'react-json-prettify';
import { tomorrowNight as currentTheme } from 'react-json-prettify/dist/themes';
import { verify, login, Methods, post } from '../../api'
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Iterate, setReact, IterateiOS } from "../../iterator"
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
  CTabContent
} from '@coreui/react'

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
export class add extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      selected: [],
      collectionNames: [],

      relation: {
        relations: [{
          relationName: "",
          id: "",
        }],

        contents: [],
      },
      activeKey: 1,
      contentString: "",
      collectionString: "",
      method: "addRelation",
      react_method: "AddRelation",
      reactString: "{}",
      iosString: "[]"


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
        collectionNames: col.values
      });
      this.getCollectionContentRequest(col.values[0]);
    } else {
      console.log(hata);
    }

  }

  async getCollectionContentRequest(collection) {
    this.setState({ activeCollection: collection });
    const model = {
      "collectionName": collection
    }

    await post(model, Methods.GetCollections).then(function (result) {
      onay = true
      collectionsResponse = result
    }, err => {
      try {
        hata = err.response.data
      } catch {
        hata = err.message
      }
    });
    const pureValues = [];
    for (let i = 0; i < collectionsResponse.data.values.length; i++) {
      let isExists = false;
      for (let j = 0; j < this.state.selected.length; j++) {
        if (this.state.selected[j].id === collectionsResponse.data.values[i].id) {
          isExists = true;
          break;
        }
      }
      if (!isExists) {
        pureValues.push(collectionsResponse.data.values[i]);
      }
    }

    this.setState({
      items: pureValues
    });
  }

  id2List = {
    droppable: 'items',
    droppable2: 'selected',
  };

  getList = id => this.state[this.id2List[id]];

  onDragEnd = async (res) => {
    const { source, destination } = res;

    // dropped outside the list
    if (!destination) {
      return;
    }
    console.log(this.state.items);
    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index,
      );

      let state = { items };

      if (source.droppableId === 'droppable2') {
        const relation = JSON.parse(JSON.stringify(this.state.relation));
        relation.relations[0].id = items[0].id;
        relation.contents = [];

        items.map((item, index) => (
          index > 0
            ?
            (
              relation.contents.push({ id: item.id })
            )
            :
            (
              console.log("ok")
            )
        ));
        state = { selected: items, relation };
      }

      await this.setState(state);
    } else {
      if (source.droppableId === "droppable2") {

      } else {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination,
        );

        const relation = JSON.parse(JSON.stringify(this.state.relation));
        relation.relations[0].id = result.droppable2[0].id;
        relation.contents = [];

        result.droppable2.map((item, index) => (
          index > 0
            ?
            (
              relation.contents.push({ id: item.id })
            )
            :
            (
              console.log("ok")
            )
        ));

        await this.setState({
          items: result.droppable,
          selected: result.droppable2,
          relation
        });
      }
    }
    this.setCode()
  };

  collectionComboboxOnChanged(e) {
    this.getCollectionContentRequest(e.target.value);
  }

  async relationNameOnChange(e) {
    const relation = JSON.parse(JSON.stringify(this.state.relation));
    relation.relations[0].relationName = e.target.value;
    await this.setState({
      relation
    });
    this.setCode()
  }

  async removeDraggableItem(index) {
    const copiedSource = [...this.state.selected];
    const collectionName = copiedSource[index].collectionName;
    copiedSource.splice(index, 1);
    this.setState({
      selected: copiedSource
    });
    if (this.state.activeCollection === collectionName) {

      this.getCollectionContentRequest(collectionName)

      if (copiedSource.length > 0) {
        const relation = JSON.parse(JSON.stringify(this.state.relation));
        relation.relations[0].id = copiedSource[0].id;
        relation.contents = [];

        copiedSource.map((item, index) => (
          index > 0
            ?
            (
              relation.contents.push({ id: item.id })
            )
            :
            (
              console.log("ok")
            )
        ));
        await this.setState({
          relation
        });
      } else {
        const relation = {
          relations: [{
            relationName: this.state.relation.relations[0].relationName,
            id: "",
          }],
          contents: []
        }
        await this.setState({
          relation
        });
      }

    } else {
      if (index == 0) {
        const relation = {
          relations: [{
            relationName: this.state.relation.relations[0].relationName,
            id: "",
          }],
          contents: []
        }
        await this.setState({
          relation
        });

      }
    }
    this.setCode()
  }
  async setCode() {
    /*  var strd = ""
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
     this.setReact() */
    var strd = "JSONObject sendObject=new JSONObject();\n"
    var sc = "{}"
    var item = this.state.relation
    await Iterate(item, strd, "sendObject", 0, "").then(function (result) {
      strd = result
    }, err => {
      console.log(err)
    });
    this.setState({ contentString: strd })
    await setReact(this.state.relation).then(function (result) {
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
      <CCard className="mb-4">
        <ToastContainer />
        <CCardHeader style={{ color: '#4f5d73', backgroundColor: "#fff" }} component="h5" className='p-2'>Add Relation</CCardHeader>
        <CCardBody className='m-1'>
          <CRow>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <CRow>
                <CCol md={6}>
                  <p className="card-description"> Collections </p>
                  <CFormSelect onChange={this.collectionComboboxOnChanged.bind(this)} as="select" className="mx-1 mb-3">
                    {
                      this.state.collectionNames.map((item, index) => (
                        <option name="type" value={item}>{item}</option>
                      ))
                    }
                  </CFormSelect>
                  <Column droppableId="droppable" data={this.state.items} {...this.props} />
                </CCol>
                <CCol md={6}>
                  <p className="card-description">Related Collections </p>
                  <Form.Control value={this.state.relation.relations[0].relationName} onChange={this.relationNameOnChange.bind(this)} type="text" name="relation-name" placeholder="Relation Name" className="mb-3 mx-1" />
                  <Column droppableId="droppable2" removeDraggableItem={this.removeDraggableItem.bind(this)} data={this.state.selected} {...this.props} />
                </CCol>
              </CRow>
              {/*  <div>
                <CButton className='float-end' size='sm' onClick={this.createRelationOnClickHandler.bind(this)} color="secondary"><CIcon icon={icon.cilPlus} size="l" />Create Relation</CButton>
              </div> */}
            </DragDropContext>
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
                <div><CButton className='float-end' size='sm' color='secondary' onClick={this.copyText.bind(this, "android")}><CIcon icon={icon.cilCopy} size="xs" /> Copy</CButton></div>
                <div id="android">
                  <pre><span className='import'>{"import"}</span>{" com.mubo.genetous_http.PostGet;\n" +
                    ""}<span className='import'>{"import"}</span>{" com.mubo.genetous_http.PostGetBuilder;\n" +
                      ""}<span className='import'>{"import"}</span>{" com.mubo.genetous_http.response;\n" +
                        ""}<span className='import'>{"import"}</span>{" org.json.JSONObject\n\n"}
                  </pre>
                  <pre className='code_void'>{"void "}<span className='code_void_name'>{"add_relation()"}</span><span>{"{\n"}</span></pre>

                  <pre className='px-5'>{
                    this.state.contentString
                  }
                    <br />
                    <span className='code_void'>{"new "}</span>{"PostGetBuilder()\n" +
                      ".setActivity("}<span className='code_void'>this</span>{")\n" +
                        ".setMethod(PostGet.REQUEST_METHODS."}<span className='property'>{"POST"}</span>{")\n" +
                          ".setToken(token)\n" +
                          ".setJsonPostData(sendObject.toString())\n" +
                          ".setReturn_type(PostGet.RETURN_TYPE."}<span className='property'>{"JSONARRAY"}</span>{")\n" +
                            ".setHost("}<span className='str_text'>ip</span>{")\n" +
                              ".setUrlType(PostGet.URL_TYPE."}<span className='property'>{this.state.method}</span>{")\n" +
                                ".setCompletionHandler("}<span className='code_void'>{"new "}</span>{"PostGet.completionHandler() {\n" +
                                  "    "}<span className='override'>@Override</span>{"\n" +
                                    "    "}<span className='code_void'>public void </span><span className='code_void_name'>onHttpFinished</span>{"(response response) {\n" +
                                      "        JSONArray j=response.getJsonArray();\n" +
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
                    <span className='ios_blue'>{".setReturn_type"}</span>(RETURN_TYPE.JSONARRAY){"\n"}
                    <span className='ios_blue'>{".setHost"}</span>(<span className='str_text'>ip</span>){"\n"}
                    <span className='ios_blue'>{".setUrlType"}</span>(URL_TYPE.{this.state.method}.description{")\n"}
                    <span className='ios_blue'>{".setToken"}</span>(token){"\n"}

                    <span className='ios_blue'>{".createPost"}</span>(){"\n"}
                    <span className='ios_blue'>{".process"}</span>(){"{response "}<span className='ios_red'>in</span>{"\n"}
                    <span>{"  DispatchQueue.main.async {\n"}</span>
                    <span className='ios_red'>    let </span>data:<span className='ios_blue'>[NSDictionary]</span> = response?.JsonArray{"\n"}
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
                  <pre><span className='import'>{"async "}</span><span className=''>{"addRelationOnClickHandler() {\n"}</span></pre>

                  <pre className='px-5'>
                    <span className='import'>{"const "}</span>{"addRelation = " + this.state.reactString + "\n\n"
                    }
                    <span className='await'>{"await "}</span>{"post(addRelation, Methods." + this.state.react_method + ").then("}<span className='import'>{"function "}</span>{"(result) {\n" +
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
      /*  <div className="col-12 grid-margin">
       <div className="card">
         <div className="card-body">
           <h4 className="card-title">Relate Collection</h4>
           <form className="form-sample">
             <div className="row">
               <DragDropContext onDragEnd={this.onDragEnd}>
                 <div className="col-md-6">
                   <p className="card-description"> Collections </p>
      
                   <Form.Control onChange={this.collectionComboboxOnChanged.bind(this)} as="select" style={{ color: "white" }} className="mx-1 mb-3">
                     {
                       this.state.collectionNames.map((item, index) => (
                         <option name="type" value={item}>{item}</option>
                       ))
                     }
                   </Form.Control>
      
                   <Column droppableId="droppable" data={this.state.items} {...this.props} />
                 </div>
                 <div className="col-md-6">
                   <p className="card-description">Related Collections </p>
                   <Form.Control value={this.state.relation.relations[0].relationName} onChange={this.relationNameOnChange.bind(this)} type="text" name="relation-name" placeholder="Relation Name" className="mb-3 mx-1" />
                   <Column droppableId="droppable2" removeDraggableItem={this.removeDraggableItem.bind(this)} data={this.state.selected} {...this.props} />
                 </div>
               </DragDropContext>
             </div>
             <div className="col-md-12 pt-4">
               <div className="card">
                 <div className="card-body">
                   <JSONPretty
                     json={this.state.relation}
                     theme={currentTheme}
                   />
                 </div>
               </div>
               <button onClick={this.createRelationOnClickHandler.bind(this)} type="button" class=" btn btn-primary btn-lg"><i class="mdi mdi-plus"></i>Create Relation</button>
             </div>
           </form>
         </div>
       </div>
      </div> */

    );
  }
}
export default add