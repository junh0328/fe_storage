import React, { useCallback, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { CustomForm, DragContainer, ButtonContainer } from "./app_style";

/**
 * Array 구조의 DnD
 */

const App = () => {
  const [items, setItems] = useState([
    { id: `1`, content: `item 1` },
    { id: `2`, content: `item 2` },
    { id: `3`, content: `item 3` },
    { id: `4`, content: `item 4` },
    { id: `5`, content: `item 5` },
  ]);
  const cnt = useRef(6);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const arr = reorder(items, result.source.index, result.destination.index);

    setItems(arr);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onAdd = useCallback(() => {
    let arr = [];

    arr = [...items];

    arr.push({
      id: cnt.current.toString(),
      content: "item " + cnt.current.toString(),
    });

    setItems(arr);
    cnt.current += 1;
  }, [items, cnt]);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log("items: ", items);
    },
    [items]
  );

  return (
    <CustomForm onSubmit={onSubmit}>
      <ButtonContainer>
        <button type="button" onClick={onAdd}>
          Add
        </button>
        <button type="button" onClick={onSubmit}>
          Submit
        </button>
      </ButtonContainer>

      <DragContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className="flex"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span className="content" type="text">
                          {item.content}
                        </span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </DragContainer>
    </CustomForm>
  );
};

export default App;
