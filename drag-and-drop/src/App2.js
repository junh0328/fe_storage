import React, { useCallback, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { CustomForm, DragContainer, ButtonContainer } from "./app_style";

/**
 * Dictionary 구조의 DnD
 */

const App2 = () => {
  const [items, setItems] = useState({
    1: { id: `1`, content: `item 1` },
    2: { id: `2`, content: `item 2` },
    3: { id: `3`, content: `item 3` },
    4: { id: `4`, content: `item 4` },
    5: { id: `5`, content: `item 5` },
  });
  const cnt = useRef(6);

  const onDragEnd = (result) => {
    console.log("result: ", result);
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const arr = reorder(
      Object.values(items),
      result.source.index,
      result.destination.index
    );
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

    arr = { ...items };

    arr[`${cnt.current}`] = {
      id: cnt.current.toString(),
      content: "item " + cnt.current.toString(),
    };

    console.log("arr: ", arr);

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
                {Object.entries(items).map(([index, item]) => (
                  <Draggable
                    key={Number(item.id)}
                    draggableId={item?.id || index}
                    index={Number(index)}
                  >
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

export default App2;
