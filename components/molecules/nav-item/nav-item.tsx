import { Menu as MenuProps } from "@/utils/helpers";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Heading } from "../../atoms/heading";

interface NavItemProps {
  menu: MenuProps;
  handleActive: (value: boolean) => void;
  active: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavItem: React.FC<NavItemProps> = ({
  menu,
  active,
  handleActive,
  setOpen,
}) => {
  return (
    <>
      <Menu as="div" className="relative inline-block text-center">
        {() => (
          <>
            {menu.path.includes("http") ? (
              <a
                href={menu.path}
                className={`flex h-10 w-full items-center justify-center px-5 my-4 md:my-6 font-heading text-[16px] font-bold leading-[24px] hover:bg-neutral-0 hover:text-primary-dark ${
                  active ? "text-primary-dark" : " text-primary-light"
                }`}
                onClick={() => {
                  setOpen && setOpen(false);
                  handleActive(false);
                }}
                target="_blank"
                rel="noreferrer"
              >
                <Heading size="lg">{menu.label}</Heading>
              </a>
            ) : (
              menu.children?.length === 0 &&
              !menu.path.includes("http") && (
                <Link
                  href={menu.path}
                  onClick={() => {
                    setOpen && setOpen(false);

                    handleActive(false);
                  }}
                  className={`flex h-10 w-full items-center justify-center px-5 my-4 md:my-6 font-heading text-[16px] font-bold leading-[24px] hover:bg-neutral-0 hover:text-primary-dark ${
                    active ? "text-primary-dark" : " text-primary-light"
                  }`}
                  target={menu.target ? "_blank" : "_self"}
                >
                  <Heading size="lg">{menu.label}</Heading>
                </Link>
              )
            )}
          </>
        )}
      </Menu>
      {active &&
        (menu.children?.length || 0) > 0 &&
        !menu.path.includes("http") && (
          <div
            className="top-0 hidden w-screen  bg-black opacity-10 md:fixed md:left-[533px] md:z-40 md:block md:h-screen"
            onClick={() => handleActive(false)}
            onMouseEnter={() => handleActive(false)}
          ></div>
        )}
    </>
  );
};

export default NavItem;
