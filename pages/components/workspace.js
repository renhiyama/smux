import { useEffect, Fragment, useState } from "react";
import { Dialog, Transition } from '@headlessui/react';

export default function Workspace({ }) {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:6930');
    ws.addEventListener('message', function incoming(data) {
      console.log(data);
    });
    ws.addEventListener('open', function open() {
      ws.send('something');
    });
    return (() => {
      ws.close();
    });
  }, []);
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (<>
    <div className="px-4 py-4">
      <h3 className="text-sm font-semibold uppercase">Workspace</h3>
      <div className="flex">
        <div className="mt-4 flex bg-slate-900 w-full lg:w-96 items-center overflow-hidden p-2 rounded-md border-2 border-slate-700 focus-within:border-blue-500/70">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input className="px-1 bg-slate-900 focus:outline-none w-full" placeholder="Search Your Recent Projects" />
        </div>
        <div className="ml-auto mt-4 grid grid-cols-2 gap-4">
          <button className="flex bg-indigo-600 py-2 px-4 items-center rounded-md text-white font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
            <span className="text-center w-full">Create Project</span></button>
          <button className="flex bg-indigo-600 py-2 px-4 items-center rounded-md text-white font-bold"
            onClick={openModal}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
            </svg><span className="text-center w-full">Connect Termux</span>
          </button>
        </div>
      </div>
    </div>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-900 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="flex text-xl font-bold items-center text-slate-200"
                >
                  <span className="h-full">Connect To Termux</span>
                  <div className="ml-auto block p-2 rounded-md bg-black">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" stroke-width={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"
                      className="w-8 h-8">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M5 7l5 5l-5 5"></path>
                      <line x1={12} y1={19} x2={19} y2={19} className="animate-pulse"></line>
                    </svg>
                  </div>
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-slate-300">
                    To connect to Termux or a linux server, copy the following command and paste it in your Termux terminal.
                  </p>
                  <div className="flex mt-4 bg-gray-900 border-2 items-center border-slate-700 px-4 py-2 rounded-md">
                    <p className="text-sm text-white">
                      <span className="text-blue-500">curl -sL https://smux.rovelstars.com/install.sh | bash</span>
                    </p>
                    <button className="ml-auto rounded-md hover:bg-gray-800 p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        className="w-6 h-6 ml-auto text-indigo-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="my-2">
                  <p className="text-sm text-slate-300">
                    Please fill in the values below to connect to your server.
                  </p>
                  <input className="mt-4 bg-gray-900 rounded-md focus:outline-none border-2 border-slate-700 focus:border-indigo-700 text-slate-300 py-2 px-4" placeholder="PORT"></input>
                  <input className="mt-4 bg-gray-900 rounded-md focus:outline-none border-2 border-slate-700 focus:border-indigo-700 text-slate-300 py-2 px-4" value="localhost" placeholder="HOST"></input>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex text-lg justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-indigo-200 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Connect!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  </>)
}