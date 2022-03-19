import React, { Component } from 'react';
import axios from 'axios';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from '../relation/Column';
import { Form } from 'react-bootstrap';
import JSONPretty from 'react-json-prettify';
import { tomorrowNight as currentTheme } from 'react-json-prettify/dist/themes';
import { verify, login, Methods, post } from '../../api'
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { verify, login, Methods, post } from '../../api'
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
    var collectionsResponse = null
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
    this.props.onUpdateCollection(this.state.relation)
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
    this.props.onUpdateCollection(this.state.relation)
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
    this.props.onUpdateCollection(this.state.relation)
    this.setCode()
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
  async setReact(st) {
    var sc = JSON.stringify(this.state.relation, null, 4)
    if (sc === "null") {
      sc = "{}"
    }
    this.setState({ reactString: sc })
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
            </DragDropContext>
          </CRow>
        </CCardBody>

      </CCard>

    );
  }
}
export default add