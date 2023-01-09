import { Dispatch, Fragment, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckoutForm } from "@/components/organisms/forms/";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";

const stripe = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

interface Props {
  isModalOpen: boolean;
  clientSecret: string;
  price: number;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const CheckoutModal: React.FC<Props> = ({
  setModalOpen,
  isModalOpen,
  clientSecret,
  price,
}) => {
  return (
    <Transition show={isModalOpen} as={Fragment}>
      <Dialog onClose={() => setModalOpen(false)} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed overflow-y-auto inset-0">
          <div className="flex min-h-full items-center justify-center text-center md:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[720px] transform overflow-hidden text-left align-middle transition-all bg-primary-dark p-6 md:p-10  rounded-lg">
                <Elements
                  stripe={stripe}
                  options={{ appearance: { theme: "night" }, clientSecret }}
                >
                  <CheckoutForm price={price} />
                </Elements>
                <button
                  className="absolute top-3 right-3 z-10 h-5 w-5"
                  onClick={() => setModalOpen(false)}
                >
                  <Image
                    src="/icons/close-icon.svg"
                    width={20}
                    height={20}
                    alt="close-icon"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CheckoutModal;
