import { Heading } from "@/components/atoms/heading";
import { Dropdown } from "@/components/molecules/dropdown";
import { NavItem } from "@/components/molecules/nav-item";
import { TodoContext } from "@/context/todo-context";
import { useReactSupabaseClient } from "@/hooks/useReactSupabaseClient";
import { Users } from "@/utils/database.types";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import pages from "@/data/pages.json";
import { Fragment, useContext, useState } from "react";

interface Props {
  user: Users | null;
}

const NavBar: React.FC<Props> = ({ user }) => {
  const { supabase } = useReactSupabaseClient();
  const router = useRouter();
  const { todoCategories } = useContext(TodoContext);
  const [open, setOpen] = useState<boolean>(false);
  const [isMenuActive, setMenuActive] = useState<boolean[]>(
    pages.map(() => false)
  );
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push("/login");
  };

  const handleMenuActive = (value: boolean, index: number) => {
    if (!value) {
      setMenuActive(pages.map(() => false));
      return;
    }
    setMenuActive(() => {
      const deactivateAllMenus = pages.map(() => false);
      deactivateAllMenus[index] = value;
      return deactivateAllMenus;
    });
  };

  const dropdownItems = todoCategories?.map((item) => {
    return {
      title: item,
    };
  });

  return (
    <nav className="bg-primary-dark items-center text-white p-4 md:px-12 md:py-6 flex justify-between ">
      <>
        <Link href={"/"} className="lg:hidden block">
          <Heading size="lg">Home</Heading>
        </Link>
        {/* DESKTOP */}
        <div className="hidden lg:flex gap-6 items-center">
          {user && (
            <>
              <Link href={"/"} className="hidden lg:block">
                <Heading size="lg">Home</Heading>
              </Link>
              {user.plan === "free" && (
                <Link href={"/pricing"}>
                  <Heading size="lg">Pricing</Heading>
                </Link>
              )}
              {pages.map((page) => (
                <Link href={page.path} key={page.label}>
                  <Heading size="lg">{page.label}</Heading>
                </Link>
              ))}
              {(todoCategories?.length ?? 0) > 0 && (
                <Dropdown
                  isNavbar={true}
                  title="Categories"
                  dropdownItems={dropdownItems as any}
                />
              )}
            </>
          )}
        </div>
        <div className="hidden lg:block">
          {!user ? (
            <Link href={"/login"}>
              <Heading size="lg">Sign In</Heading>
            </Link>
          ) : (
            <button onClick={handleLogout}>
              <Heading size="lg">Logout</Heading>
            </button>
          )}
        </div>
        {/* MOBILE */}
        <div className="lg:hidden block">
          <button
            className="ml-auto grid h-10 w-10 items-center "
            aria-label="Navigation Menu"
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => {
              setMenuActive(() => pages.map(() => false));
              setOpen((prev) => !prev);
            }}
          >
            {open ? (
              <span className="p-2">
                <Image
                  src="/icons/close-icon.svg"
                  width={20}
                  height={20}
                  alt="close-icon"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </span>
            ) : (
              <Image
                src="/icons/menu-icon.svg"
                width={20}
                height={20}
                alt="menu-icon"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            )}
          </button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div
              id="mobile-menu"
              role="menu"
              className="fixed top-[72px] left-0 z-40 h-[calc(100vh-calc(100vh-100%+56px))] w-screen bg-white lg:hidden"
            >
              <div className=" flex items-center h-[calc(100vh-308px)] w-full flex-col overflow-auto">
                {user?.plan === "free" && (
                  <Link href={"/pricing"} className="text-primary-light my-4">
                    <Heading size="lg">Pricing</Heading>
                  </Link>
                )}
                {pages.map((menu, index) => (
                  <NavItem
                    menu={menu}
                    key={index}
                    active={isMenuActive[index]}
                    handleActive={(value) => handleMenuActive(value, index)}
                    setOpen={setOpen}
                  />
                ))}
                <div className="my-4 md:my-6">
                  <Dropdown
                    isNavbar={true}
                    title="Categories"
                    dropdownItems={dropdownItems as any}
                  />
                </div>
                <div className="my-4 md:my-6 text-primary-light">
                  {!user ? (
                    <Link href={"/login"}>
                      <Heading size="lg">Sign In</Heading>
                    </Link>
                  ) : (
                    <button onClick={handleLogout}>
                      <Heading size="lg">Logout</Heading>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </>
    </nav>
  );
};

export default NavBar;
