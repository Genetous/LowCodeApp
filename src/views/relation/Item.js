import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import NaturalDragAnimation from '../../../src/NaturalDragAnimation';
import JSONPretty from 'react-json-prettify';
import { tomorrowNight as currentTheme } from 'react-json-prettify/dist/themes';


const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? '#1D1F21' : '#1D1F21',

  // styles we need to apply on draggables
  ...draggableStyle,
});

class Item extends Component {
  render() {
    const { item, removeDraggableItem, index, droppableId, ...props } = this.props;

    return (
      <Draggable
        key={item.id}
        draggableId={item.id}
        index={index}
      >
        {(provided, snapshot) => (
          <NaturalDragAnimation
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style,
            )}
            snapshot={snapshot}
            {...props}
          >
            {style => (
              <div>
                {
                  droppableId === "droppable2"
                  &&
                  (
                    <div onClick={() => removeDraggableItem(index)}  className="my-delete-draggable-item">
                      x
                    </div>
                  )
                }
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={style}
                >

                  <JSONPretty
                    json={item.content}
                    theme={currentTheme}
                  />
                </div>
              </div>
            )}
          </NaturalDragAnimation>
        )}
      </Draggable>
    );
  }
}

export default Item;
