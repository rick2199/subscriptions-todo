import React from "react";
import Image from "next/image";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

interface FormDescriptionProps {
  title: string;
  content: string;
  children?: React.ReactNode;
}

const FormDescription: React.FC<FormDescriptionProps> = ({
  title,
  content,
  children,
}) => {
  return (
    <div className="flex flex-col items-start text-left gap-4">
      <Heading size="xl">{title}</Heading>
      <Text size="md" className="!text-text-light text-left">
        {content}
        {children}
      </Text>
    </div>
  );
};

const FormInfo = () => {
  return (
    <div className="flex flex-row items-start gap-3 text-left text-text-light bg-[#FEFCEC] p-4">
      <Image
        src="/icons/info-icon.svg"
        height={24}
        width={24}
        className="flex-none"
        alt="thedefiant-help"
      />
      <span className="text-sm">
        Still not working?, Please try again in a few seconds{" "}
      </span>
    </div>
  );
};

export { FormInfo, FormDescription };
