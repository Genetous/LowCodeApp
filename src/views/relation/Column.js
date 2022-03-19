import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';

import Item from './Item';

const grid = 8;

const getListStyle = isDraggingOver => ({
  background: 'black',
  padding: grid,
  minHeight:80
});

class Column extends Component {
    static propTypes = {
      droppableId: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    };

    render() {
      const { droppableId,removeDraggableItem, data, ...props } = this.props;

      return (
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.props.data.map((item, index) => (
                <Item droppableId={droppableId} removeDraggableItem={removeDraggableItem} item={item} index={index} key={item.id} {...props} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      );
    }
}

export default Column;
