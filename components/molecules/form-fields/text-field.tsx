import React, { useState } from "react";
import Image from "next/image";
import { Field } from "formik";
import { Heading } from "@/components/atoms/heading";
import { ErrorMessage } from "@/components/atoms/error-message";
import Link from "next/link";
interface TextFieldProps {
  label?: string;
  touched?: boolean;
  error?: string;
  type: string;
  placeholder?: string;
  name?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  touched,
  error,
  type,
  name,
  placeholder,
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
    <div className={`relative flex flex-col !text-left w-full`}>
      {label && (
        <label className="flex justify-between">
          <Heading size="sm">{label}</Heading>
        </label>
      )}
      <Field
        type={
          (type === "text" && "text") ||
          (type === "email" ? "email" : "password")
        }
        placeholder={`${
          placeholder
            ? placeholder
            : type === "email"
            ? "youremail@domain.com"
            : "Enter your password"
        }`}
        id={`${type}id`}
        className={`w-full rounded border-2 bg-neutral-100 py-2 px-4 font-body ${
          touched && error ? "border-[#FB2834]" : "focus:border-primary-light"
        } focus:outline-none`}
        name={name ? name : type}
      />

      {touched && (
        <>
          <ErrorMessage error={error as string} name={name ? name : type} />
        </>
      )}
      {type === "password" || type === "confirmPassword" ? (
        <button
          className="absolute top-[32px] right-2 cursor-pointer"
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
        </button>
      ) : touched && error ? (
        <Image
          src={`/icons/error-icon.svg`}
          className="absolute top-[32px] right-2"
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
