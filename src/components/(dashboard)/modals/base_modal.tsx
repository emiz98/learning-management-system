import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";

type Props = {
  isOpen: boolean;
  setIsOpen: Function;
  title: string;
  Content: any;
  className?: string;
  id?: number;
};

const BaseModal = ({
  isOpen,
  setIsOpen,
  title,
  Content,
  className,
  id,
}: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={twMerge(
                  "w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-5 text-left align-middle shadow-md transition-all text-black",
                  className
                )}
              >
                <div className="flex items-center justify-between mb-5">
                  <h5 className="font-medium text-lg">{title}</h5>
                  <XMarkIcon
                    className="h-7 object-contain p-1 border border-gray-500 rounded-full cursor-pointer hover: hover:bg-gray-100 duration-150"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                <Content setIsOpen={setIsOpen} id={id} />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BaseModal;
