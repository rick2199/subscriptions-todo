import React, { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { ErrorMessage, Field } from "formik";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
interface TextFieldProps {
  label: string;
  touched: boolean;
  error: string;
  type: string;
  placeHolder?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  touched,
  error,
  type,
  placeHolder,
}) => {
  const input =
    typeof window !== "undefined"
      ? (document?.getElementById(
          `${type !== "email" && type}id`
        ) as HTMLInputElement)
      : null;

  const [inputVisibility, setInputVisibiity] = useState<boolean>(false);
  const handleInputVisibility = () => {
    if (input) {
      if (input.type === "text") {
        setInputVisibiity(false);
        input.type = "password";
      } else {
        setInputVisibiity(true);
        input.type = "text";
      }
    }
  };
  return (
    <div className={`relative flex flex-col gap-1 !text-left`}>
      <label className="flex justify-between">
        <Heading size="sm">{label}</Heading>
      </label>
      <Field
        type={
          (type === "userName" && "text") ||
          (type === "email" ? "email" : "password")
        }
        placeholder={`${
          placeHolder
            ? placeHolder
            : (type === "userName" && "Enter a username") ||
              (type === "email"
                ? "youremail@domain.com"
                : "Enter your password")
        }`}
        id={`${type}id`}
        className={`w-full rounded border-2 bg-neutral-100 py-2 px-4 font-body ${
          touched && error ? "border-[#FB2834]" : "focus:border-[#27F19A]"
        } focus:outline-none`}
        name={type}
      />

      {touched && (
        <ErrorMessage
          name={type}
          component={() => <Text className="text-[#FB2834]">{error}</Text>}
        />
      )}
      {type === "password" || type === "confirmPassword" ? (
        <a
          className="absolute top-9 right-2 cursor-pointer"
          title={`${inputVisibility ? "View Password" : "Hide Password"}
      `}
          onClick={() => handleInputVisibility()}
        >
          <Image
            src={`/icons/${
              touched && error
                ? "error-icon"
                : inputVisibility
                ? "eye-icon"
                : "closed-eye-icon"
            }.svg`}
            alt="eye-icon"
            height={24}
            width={24}
          />
        </a>
      ) : touched && error ? (
        <Image
          src={`/icons/error-icon.svg`}
          className="absolute top-9 right-2"
          alt="eye-icon"
          height={24}
          width={24}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default TextField;
