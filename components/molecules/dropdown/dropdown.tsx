import { Heading } from "@/components/atoms/heading";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";

export interface DropdownItems {
  handleClick: () => void;
  title: string;
}

interface Props {
  title: string;
  isNavbar?: boolean;
  dropdownItems: (DropdownItems | undefined)[];
}

const Dropdown: React.FC<Props> = ({ title, dropdownItems, isNavbar }) => {
  const router = useRouter();

  return (
    <Menu as="div" className="relative inline-block w-fit">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-primary-light px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {isNavbar ? <Heading size="md">{title}</Heading> : title}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute right-0 z-10 mt-1 text-right origin-top-right divide-y  bg-white divide-gray-100 rounded-md  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
            isNavbar ? "w-full" : "w-fit"
          }`}
        >
          {dropdownItems?.map((item, index) => {
            return (
              <Menu.Item key={index}>
                {({ active }) =>
                  !isNavbar ? (
                    <button
                      onClick={item?.handleClick}
                      className={`${
                        active && item?.title === "Delete"
                          ? "bg-error text-white"
                          : active
                          ? "bg-primary-light text-white"
                          : "text-primary-dark"
                      } px-4 py-2  flex w-full items-center rounded-md  text-sm`}
                    >
                      {item?.title}
                    </button>
                  ) : (
                    <Link
                      href={
                        `${
                          router.pathname.includes("category")
                            ? item?.title.toLowerCase()
                            : `category/${item?.title.toLowerCase()}`
                        }` as string
                      }
                      className={`${
                        active && item?.title === "Delete"
                          ? "bg-error text-white"
                          : active
                          ? "bg-primary-light text-white"
                          : "text-primary-dark"
                      } px-4 py-2  flex w-full items-center rounded-md  text-sm`}
                    >
                      {item?.title}
                    </Link>
                  )
                }
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
