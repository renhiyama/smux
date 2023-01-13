import ControlButton from "./controls/button";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Controls() {
  const [project, setProject] = useState("Loading...");
  useEffect(() => {
    setProject(globalThis?.localStorage?.getItem("project"));
  }, []);
  return (
    <div
      id="controls"
      className="h-full py-4 col-span-8 lg:col-span-2 border-r border-slate-700"
    >
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 stroke-[3]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
          <span className="text-sm">{project}</span>
        </a>
        <FileSystem />
      </div>
    </div>
  );
}

export function FileSystem({ paath }) {
  const [files, setFiles] = useState([]);
  const [dirs, setDirs] = useState([]);
  useEffect(() => {
    const project = globalThis?.localStorage?.getItem("project");
    globalThis.ws = new WebSocket(
      `ws://${localStorage.getItem("host")}:${localStorage.getItem("port")}`
    );
    ws.addEventListener("open", () => {
      ws.addEventListener("message", (e) => {
        let data = JSON.parse(e.data);
        if (data.type === "list_files") {
          setFiles(data.files);
          setDirs(data.dirs);
        }
      });
      ws.send(
        JSON.stringify({
          type: "list_files",
          project: localStorage.getItem("project"),
          path: paath || "",
        })
      )?.catch((e) => {});
    });
    return () => {
      ws.close();
    };
  }, []);
  return (
    <ul className={paath ? "" : "overflow-y-auto"}>
      {dirs.map((dir) => {
        console.log(paath ? paath + "/" + dir : dir);
        return (
          <li className="text-slate-300 hover:bg-slate-700 px-4">
            <span className="flex">
              <Image
                src="/fileicons/default_folder.svg"
                width={20}
                height={20}
                className="my-auto mr-2"
                alt="folder-logo"
              />
              <span className="text-slate-200">{dir}</span>
            </span>
            <FileSystem paath={paath ? paath + "/" + dir : dir} />
          </li>
        );
      })}
      {files.map((file) => {
        return (
          <li className="text-slate-300 hover:bg-slate-700 px-4">
            <span className="flex">
              <Image
                src="/fileicons/default_file.svg"
                width={20}
                height={20}
                className="my-auto mr-2"
                alt="file-logo"
              />
              <span className="text-slate-200">{file}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
