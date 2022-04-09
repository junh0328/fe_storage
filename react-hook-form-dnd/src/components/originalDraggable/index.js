import React, { useCallback, useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useForm, useFieldArray } from "react-hook-form";

import { DragContainer, ButtonContainer } from "./style";

// props 라고 가정
const items = [];

const OriginalDraggable = () => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { dragItems: items },
    shouldUseNativeValidation: true,
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "dragItems",
  });

  const [currentIdx, setCurrentIdx] = useState(-1);
  const currentOrder = useRef(1);
  const watchFields = watch("dragItems");

  useEffect(() => {
    if (fields.length === 0) {
      currentOrder.current = 1;
    }
  }, [fields]);

  useEffect(() => {
    if (currentIdx !== -1) {
      console.log(
        `${currentIdx} is a current watchFields: `,
        watchFields.find((field) => field.order === currentIdx)?.text
      );
    }
  }, [watchFields, currentIdx]);

  const onSubmit = (data) => console.log("success: ", data);
  const onError = (errors) => console.log("errors: ", errors);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }

    move(result.source.index, result.destination.index);
  };

  const onFilter = useCallback(
    (index) => {
      remove(index);
    },
    [remove]
  );

  return (
    <DragContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        <form onSubmit={() => console.log("submit")}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <FiledList
                  fields={fields}
                  register={register}
                  isSubmitting={isSubmitting}
                  onFilter={onFilter}
                  setCurrentIdx={setCurrentIdx}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <ButtonContainer>
            <button
              type="button"
              onClick={() => {
                append({
                  order: currentOrder.current.toString(),
                  content: `item ${currentOrder.current}`,
                  text: "",
                });
                currentOrder.current += 1;
              }}
              disabled={isSubmitting}
            >
              Add
            </button>
            <button type="button" onClick={handleSubmit(onSubmit, onError)}>
              Submit
            </button>
          </ButtonContainer>
        </form>
      </DragDropContext>
    </DragContainer>
  );
};
const FiledList = React.memo(function FiledList({
  fields,
  register,
  onFilter,
  isSubmitting,
  setCurrentIdx,
}) {
  return fields.map((field, index) => {
    return (
      <Draggable draggableId={field.order} index={index} key={field.order}>
        {(provided, snapshot) => (
          <div
            key={field.order}
            className="flex"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <label
              style={{ width: "100%" }}
              onClick={() => setCurrentIdx(field.order)}
            >
              <input
                name={`dragItems[${index}].order`}
                ref={register()}
                type="text"
                className="id input"
                defaultValue={field.order}
                readOnly
              />

              <input
                name={`dragItems[${index}].content`}
                ref={register()}
                className="content input"
                type="text"
                defaultValue={field.content}
                readOnly
              />
              <input
                key={`${field.order}`}
                name={`dragItems[${index}].text`}
                ref={register({
                  maxLength: {
                    value: 255,
                    message: "title maximum 255",
                  },
                })}
                type="text"
                defaultValue={field.text}
                maxLength={255}
              />
            </label>
            <span onClick={() => onFilter(index)} className="remove">
              [X]
            </span>
          </div>
        )}
      </Draggable>
    );
  });
});

export default OriginalDraggable;
