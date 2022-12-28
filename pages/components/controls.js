import ControlButton from "./controls/button";
import Image from "next/image";
export default function Controls() {
  return (
    <div id="controls" className="h-full lg:max-w-sm py-4 col-span-8 lg:col-span-2 border-r border-slate-700">
      <div className="flex px-4">
        <h3 className="text-sm font-semibold uppercase mr-auto">Files</h3>
        <ControlButton name="search" />
        <ControlButton name="location" />
        <ControlButton name="new-file" />
        <ControlButton name="new-folder" />
        <ControlButton name="more" />
      </div>
      <div className="mt-4">
        <a className="px-2 py-1 flex text-slate-300 font-bold hover:bg-slate-700 transition duration-150">
          <span className="my-auto mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 stroke-[3]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
          <span className="text-sm">Project Name</span>
        </a>
        <ul>
          <li className="text-slate-300 bg-slate-700 px-4">
            <span className="flex">
              <span className="border-r border-slate-500 mr-2"></span>
              <Image src="/fileicons/file_type_js.svg" width={20} height={20} className="my-auto mr-2" alt="javascript-logo" />
              <span className="text-slate-200">test.js</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}