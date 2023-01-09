import { Dispatch, useState } from "react";
import { Combobox } from "@headlessui/react";
import { ErrorMessage } from "@/components/atoms/error-message";
import { useField } from "formik";
import { ChevronIcon } from "@/components/atoms/dynamic-icons";

interface Props {
  selected: any;
  setSelected: Dispatch<any>;
  touched: boolean;
  error: string;
  fieldName: string;
  values: any[];
}

const ComboBox: React.FC<Props> = ({
  selected,
  setSelected,
  error,
  touched,
  fieldName,
  values,
}) => {
  const [query, setQuery] = useState<string>("");
  const [_, __, { setTouched }] = useField(fieldName);

  const filteredValues =
    query === ""
      ? values
      : values?.filter((value) => {
          return value.toLowerCase().includes(query.toLowerCase());
        });

  if (query || selected) {
    error = "";
  }

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="relative">
        <Combobox.Input
          className={`text-black w-full py-2 border-2 border-primary-dark px-4 rounded-md ${
            touched && error ? " border-error" : "focus:border-primary-light"
          }`}
          name={fieldName}
          type="text"
          placeholder={`Choose your ${fieldName}`}
          onChange={(event: any) => {
            setTouched(true);
            setQuery(event.target.value);
          }}
        />
        <Combobox.Button className="absolute top-[10px] right-2 flex items-center ">
          <ChevronIcon color={`${touched && error && "#FB2834"}`} />
        </Combobox.Button>
      </div>
      <Combobox.Options className="bg-white border-2 border-primary-dark text-primary-dark max-h-[130px] overflow-auto px-2 rounded-b-md">
        {query.length > 0 && (
          <Combobox.Option
            value={query}
            className="hover:cursor-pointer rounded-md p-2 hover:bg-primary-dark hover:text-white"
          >
            Create {query}
          </Combobox.Option>
        )}
        {filteredValues?.map((value) => (
          <Combobox.Option
            key={value}
            value={value}
            className="hover:cursor-pointer rounded-md p-2 hover:bg-primary-dark hover:text-white"
          >
            {value}
          </Combobox.Option>
        ))}
      </Combobox.Options>
      {touched && <ErrorMessage error={error as string} name="category" />}
    </Combobox>
  );
};

export default ComboBox;
