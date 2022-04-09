import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const test = [
  { item: "1", value: "wow" },
  { item: "2", value: "wow2" },
];

const FieldsArr = () => {
  const { control, register, watch, setValue } = useForm({
    defaultValues: { test: test },
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "test", // unique name for your Field Array
    }
  );

  console.log("watch fields: ", watch("test"));

  return (
    <div>
      <h1>Field Arr</h1>
      {fields.map((field, index) => {
        console.log("field: ", field);
        console.log("index: ", index);
        return (
          <input
            key={field.id} // important to include key with field's id
            {...register(`test.${index}.value`)}
          />
        );
      })}
    </div>
  );
};

export default FieldsArr;
