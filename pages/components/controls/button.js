import React, { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

let icons = {
  search: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      name="search"
      className="ml-auto control-icons"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  ),
  refresh: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  ),
  "new-file": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      name="new-file"
      className="control-icons"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  ),
  "new-folder": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      name="new-folder"
      className="control-icons"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
      />
    </svg>
  ),
  more: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      name="more"
      className="control-icons"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  ),
};
export default function Button({ name, onClick }) {
  let [isOpen, setIsOpen] = useState(false);
  //show a tooltip when hovering over the button, use absolute positioning to show it
  let [showTooltip, setShowTooltip] = useState(false);
  let [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  let buttonRef = useRef();
  useEffect(() => {
    let button = buttonRef.current;
    let rect = button.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top + rect.height + 5,
      left: rect.left - 5,
    });
  }, []);
  let showtmr;
  let show = () => {
    showtmr = setTimeout(() => {
      setShowTooltip(true);
    }, 1000);
  };
  let hide = () => {
    if (showtmr) clearTimeout(showtmr);
    setShowTooltip(false);
  };
  function refreshEvent() {
    let event = new CustomEvent("fileCreated", {
      detail: {},
    });
    window.dispatchEvent(event);
    window.Toast(
      "Refreshed",
      "success",
      "All your files are synced with server."
    );
  }
  let runandhide = () => {
    if (name == "new-file" || name == "new-folder") {
      setIsOpen(true);
    }
    if (name == "refresh") {
      refreshEvent();
    }
    if (onClick) onClick();
    hide();
  };
  function closeModal() {
    setIsOpen(false);
  }
  //create ref
  let fileNameRef = useRef();
  let submitRef = useRef();
  function createFile() {
    //get the file name from the ref
    let fileName = fileNameRef.current.value;
    //disable the submit button
    submitRef.current.disabled = true;
    submitRef.current.innerHTML = "Creating...";
    let dataBody =
      name == "new-file"
        ? { file: fileName, content: "" }
        : { folder: fileName };
    fetch(
      `http://${localStorage.getItem("host")}:${localStorage.getItem(
        "port"
      )}/projects/${encodeURIComponent(
        localStorage.getItem("project")
      )}/${name.replace("-", "/")}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataBody),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          closeModal();
          const event = new CustomEvent("fileCreated", {
            detail: {
              name: fileName,
            },
          });
          window.dispatchEvent(event);
        } else {
          alert(res.error);
          closeModal();
        }
      });
  }

  return (
    <div ref={buttonRef} onMouseEnter={show} onMouseLeave={hide}>
      <button onClick={runandhide}>{icons[name]}</button>
      {showTooltip && (
        <div className="z-[100] backdrop-blur-xl absolute bg-black/50 text-white font-bold text-md capitalize rounded-md p-2 shadow-lg shadow-black/50">
          {name.replaceAll("-", " ")}
        </div>
      )}
      {(name == "new-folder" || name == "new-file") && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
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

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="min-w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-900 p-6 text-left align-middle shadow-xl transition-all border-2 border-slate-800">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-slate-300 capitalize"
                    >
                      Create A {name.replaceAll("-", " ")}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-slate-400">
                        {name == "new-file" &&
                          `You can create a new file by entering the name of the file and the extension. `}
                        Paths before file/folder names are supported too.
                      </p>
                      <input
                        type="text"
                        className="w-full mt-2 p-2 rounded-md bg-slate-800 text-slate-300 border-2 border-slate-700 focus:outline-none focus:border-slate-600"
                        placeholder={
                          name == "new-file" ? "file name" : "folder name"
                        }
                        ref={fileNameRef}
                      />
                    </div>

                    <div className="mt-4 w-full">
                      <button
                        type="button"
                        ref={submitRef}
                        className="mr-2 inline-flex justify-center min-w-16 rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-500 text-base font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:text-sm"
                        autocapitalize="off"
                        autocorrect="off"
                        autocomplete="off"
                        onClick={createFile}
                      >
                        Create!
                      </button>
                      <button
                        type="button"
                        className="ml-2 inline-flex justify-center min-w-16 rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-500 text-base font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:text-sm"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
}
