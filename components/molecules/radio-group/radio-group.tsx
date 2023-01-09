import { Dispatch, SetStateAction } from "react";
import { RadioGroup } from "@headlessui/react";
import Image from "next/image";
import { useField } from "formik";

const priorities = ["High", "Medium", "Low"];

interface Props {
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  fieldName: string;
}

const RadioGroups: React.FC<Props> = ({ selected, setSelected, fieldName }) => {
  const [_, __, { setTouched }] = useField(fieldName);
  return (
    <div className="w-full lg:px-4">
      <div className=" w-full">
        <RadioGroup value={selected} onChange={setSelected}>
          <div className="flex flex-row gap-5 w-full">
            {priorities.map((priority) => (
              <RadioGroup.Option
                onClick={() => setTouched(true)}
                key={priority}
                value={priority}
                className={({ checked }) =>
                  `${
                    checked &&
                    (priority === "High"
                      ? "ring-2 ring-priority-high ring-opacity-60 ring-offset-2 ring-offset-priority-high"
                      : priority === "Medium"
                      ? "ring-2 ring-priority-medium ring-opacity-60 ring-offset-2 ring-offset-priority-medium"
                      : "ring-2 ring-priority-low ring-opacity-60 ring-offset-2 ring-offset-priority-low")
                  }
               
                 bg-white text-primary-dark px-5 relative flex cursor-pointer rounded-lg py-4 shadow-sm shadow-primary-dark focus:outline-none`
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked &&
                              (priority === "High"
                                ? "text-priority-high"
                                : priority === "Medium"
                                ? "text-priority-medium"
                                : "text-priority-low")
                            }`}
                          >
                            {priority}
                          </RadioGroup.Label>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <Image
                            src="/icons/priority-icon.svg"
                            alt="priority-icon"
                            width={24}
                            height={24}
                            className="h-6 w-6 "
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default RadioGroups;
