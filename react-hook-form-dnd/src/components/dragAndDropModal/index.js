import React, { useCallback, useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useForm, useFieldArray } from "react-hook-form";

import { DragContainer, ButtonContainer, ScriptModal } from "./style";

// props 라고 가정
const items = [
  { order: "1", content: "js", text: "", modalTitle: "", modalCotent: "" },
  { order: "2", content: "ts", text: "", modalTitle: "", modalCotent: "" },
  { order: "3", content: "java", text: "", modalTitle: "", modalCotent: "" },
  { order: "4", content: "python", text: "", modalTitle: "", modalCotent: "" },
  { order: "5", content: "c++", text: "", modalTitle: "", modalCotent: "" },
];

const DragAndDropModal = () => {
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

  const [onModal, setOnModal] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const currentOrder = useRef(6);
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
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <ButtonContainer>
                  <button
                    type="button"
                    onClick={() => {
                      append({
                        order: currentOrder.current.toString(),
                        content: `item ${currentOrder.current}`,
                        text: "",
                        modalTitle: "",
                        modalContent: "",
                      });
                      currentOrder.current += 1;
                    }}
                    disabled={isSubmitting}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit, onError)}
                  >
                    Submit
                  </button>
                </ButtonContainer>
                <FiledList
                  fields={fields}
                  isSubmitting={isSubmitting}
                  currentIdx={currentIdx}
                  onModal={onModal}
                  register={register}
                  onFilter={onFilter}
                  setCurrentIdx={setCurrentIdx}
                  setOnModal={setOnModal}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </form>
      </DragDropContext>
    </DragContainer>
  );
};
const FiledList = React.memo(function FiledList({
  fields,
  currentIdx,
  onModal,
  register,
  onFilter,
  setCurrentIdx,
  setOnModal,
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
            <label htmlFor={field.order}>
              <input
                name="radios"
                id={field.order}
                type="radio"
                onClick={() => setCurrentIdx(field.order)}
              />

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
                ref={register({ required: "need to write text" })}
                type="text"
                defaultValue={field.text}
                readOnly={currentIdx !== field.order}
              />
              <ScriptModal modalOn={currentIdx === field.order && onModal}>
                <span className="exit" onClick={() => setOnModal(false)}>
                  X
                </span>
                <div className="text_container">
                  <input
                    name={`dragItems[${index}].modalTitle`}
                    ref={register()}
                    type="text"
                    defaultValue={field.modalTitle}
                    placeholder="title"
                  />
                  <textarea
                    name={`dragItems[${index}].modalContent`}
                    ref={register()}
                    defaultValue={field.modalContent}
                    placeholder="content"
                  />

                  <button
                    type="button"
                    className="save"
                    onClick={() => setOnModal(false)}
                  >
                    save
                  </button>
                </div>
              </ScriptModal>
            </label>

            <button
              type="button"
              disabled={currentIdx !== field.order}
              onClick={() => setOnModal(true)}
            >
              modal
            </button>

            <span onClick={() => onFilter(index)} className="remove">
              [X]
            </span>
          </div>
        )}
      </Draggable>
    );
  });
});

export default DragAndDropModal;
