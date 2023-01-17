import ControlButton from "./controls/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
export default function Controls() {
  const Router = useRouter();
  const [project, setProject] = useState("Loading...");
  const [isExpanded, setIsExpanded] = useState(true);
  function toggle() {
    setIsExpanded(!isExpanded);
  }
  useEffect(() => {
    //if host or port are not set, but project is; redirect to /workspace
    if (
      !localStorage.getItem("host") ||
      (!localStorage.getItem("port") && localStorage.getItem("project"))
    ) {
      //remove project from localStorage
      localStorage.removeItem("project");
      //redirect to /workspace
      //nextjs router
      window.Toast(
        "Project not found",
        "danger",
        "Please connect to a server."
      );

      Router.push("/workspace");
      return;
    }
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
        <ControlButton name="refresh" />
        <ControlButton name="new-file" />
        <ControlButton name="new-folder" />
        <ControlButton name="more" />
      </div>
      <div className="mt-4">
        <a
          className="px-4 py-1 flex text-slate-300 font-bold hover:bg-slate-700 transition duration-150"
          onClick={toggle}
        >
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
          <span className="text-sm">{project || "No Active Project"}</span>
        </a>
        <ul className={`${isExpanded ? "" : "hidden"}`}>
          <Directory key={"__never_gonna_give_you_up__"} />
        </ul>
      </div>
    </div>
  );
}

function Directory({ path }) {
  let [files, setFiles] = useState([]);
  let [folders, setFolders] = useState([]);
  useEffect(() => {
    if (!localStorage.getItem("project")) return;
    (async () => {
      let project = globalThis?.localStorage?.getItem("project");
      if (!project) return;
      if (!path) {
        let { files, folders } = await fetch(
          `http://${localStorage.getItem("host")}:${localStorage.getItem(
            "port"
          )}/projects/${encodeURIComponent(project)}`
        ).then((res) => res.json());
        setFiles(files);
        setFolders(folders);
      } else {
        let { files, folders } = await fetch(
          `http://${localStorage.getItem("host")}:${localStorage.getItem(
            "port"
          )}/projects/${encodeURIComponent(
            project
          )}/folder/${encodeURIComponent(path)}`
        ).then((res) => res.json());
        setFiles(files);
        setFolders(folders);
      }
      //subscribe to changes
      window.addEventListener("fileCreated", async () => {
        console.log("running fileCreated");
        let project = globalThis?.localStorage?.getItem("project");
        if (!project) return;
        if (!path) {
          let { files, folders } = await fetch(
            `http://${localStorage.getItem("host")}:${localStorage.getItem(
              "port"
            )}/projects/${encodeURIComponent(project)}`
          ).then((res) => res.json());
          setFiles(files);
          setFolders(folders);
        } else {
          let { files, folders } = await fetch(
            `http://${localStorage.getItem("host")}:${localStorage.getItem(
              "port"
            )}/projects/${encodeURIComponent(
              project
            )}/folder/${encodeURIComponent(path)}`
          ).then((res) => res.json());
          setFiles(files);
          setFolders(folders);
        }
      });
    })();
  }, []);
  async function openFile(path) {
    if (localStorage.getItem("currentFile") != null) {
      //save it
      let project = globalThis?.localStorage?.getItem("project");
      let currentFile = globalThis?.localStorage?.getItem("currentFile");
      let content = editor.getValue();
      await fetch(
        `http://${localStorage.getItem("host")}:${localStorage.getItem(
          "port"
        )}/projects/${encodeURIComponent(project)}/file/${encodeURIComponent(
          currentFile
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
          }),
        }
      ).then(() => {});
    }
    let f = await fetch(
      `http://${localStorage.getItem("host")}:${localStorage.getItem(
        "port"
      )}/projects/${encodeURIComponent(
        localStorage.getItem("project")
      )}/file/${encodeURIComponent(path)}`
    ).then((res) => res.json());
    window.editor.setValue(f.content);
    window.editor.gotoLine(1);
    localStorage.setItem("currentFile", path);
  }
  return (
    <ul className="ml-2" key={"_path__" + path}>
      {folders?.map((folder) => {
        return (
          <Folder
            folder={folder}
            path={path}
            key={"folder_comp__" + (path ? path + "/" + folder : folder)}
          />
        );
      })}
      {files?.map((file) => {
        return (
          <li
            className="text-slate-300 px-4 hover:bg-slate-700"
            onClick={() => {
              openFile(path ? path + "/" + file : file);
            }}
            key={"file_comp__" + (path ? path + "/" + file : file)}
          >
            <span className="flex border-l border-slate-500 pl-2 py-1">
              <Image
                src="/fileicons/default_file.svg"
                width={20}
                height={20}
                className="my-auto mr-2"
                alt="file"
              />
              {file}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function Folder({ folder, path }) {
  const [isExpanded, setIsExpanded] = useState(false);
  function toggle() {
    setIsExpanded(!isExpanded);
  }
  return (
    <div key={"_ke_" + (path ? path + "/" + folder : folder)}>
      <li
        className="hover:bg-slate-700 text-slate-300 px-4"
        onClick={toggle}
        key={"__folder" + (path ? path + "/" + folder : folder)}
      >
        <span className="flex border-l border-slate-500 pl-2 py-1">
          <Image
            src={`/fileicons/default_folder${isExpanded ? "_opened" : ""}.svg`}
            width={20}
            height={20}
            className="my-auto mr-2"
            alt="folder"
          />
          {folder}
        </span>
      </li>
      {isExpanded && (
        <Directory
          path={path ? path + "/" + folder : folder}
          key={path ? path + "/" + folder : folder}
        />
      )}
    </div>
  );
}
