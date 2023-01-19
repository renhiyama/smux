import ControlButton from "./controls/button";
import Image from "next/image";
import { useEffect, useState, Fragment, useRef } from "react";
import { useRouter } from "next/router";
import { detectLang } from "../utils/detectLang";
import { specialFolders } from "../utils/specialFolders";

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
        <QuickControls />
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
          <span className="text-sm select-none">
            {project || "No Active Project"}
          </span>
        </a>
        <ul
          className={`${
            isExpanded ? "" : "hidden"
          } select-none overflow-auto max-h-screen`}
        >
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
        let { files, folders, error } = await fetch(
          `http://${localStorage.getItem("host")}:${localStorage.getItem(
            "port"
          )}/projects/${encodeURIComponent(project)}`
        ).then((res) => res.json());
        if (error) {
          window.Toast(error, "danger", `Project \`/${project}\` not found.`);
          localStorage.removeItem("project");
          return router.push("/workspace");
        }
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
    //if content is more than 512kb, don't open it
    if (f.content.length > 512000) {
      window.Toast(
        "File too large",
        "danger",
        "We can't open files larger than 512kb. Consider splitting your codes!"
      );
      return;
    }
    window.editor.session.setValue(f.content);
    window.editor.gotoLine(1);
    localStorage.setItem("currentFile", path);
    editor.session.setMode(
      "ace/mode/" +
        (detectLang(path) === "js" ? "javascript" : detectLang(path))
    );
    editor.setReadOnly(false);
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
                src={`/fileicons/${
                  detectLang(file)
                    ? "file_type_" + detectLang(file)
                    : "default_file"
                }.svg`}
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
            src={`/fileicons/${
              specialFolders(folder)
                ? "folder_type_" + specialFolders(folder)
                : "default_folder"
            }${isExpanded ? "_opened" : ""}.svg`}
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

function QuickControls() {
  let router = useRouter();
  //this uses menu dropdown from headlessui react
  let [isExpanded, setIsExpanded] = useState(false);
  function toggle() {
    setIsExpanded(!isExpanded);
  }
  //only include code for menu dropdown, dont use headlessui react. create from scratch
  return (
    <>
      <ControlButton onClick={toggle} name="more" />
      <div
        className={`${
          isExpanded ? "" : "hidden"
        } z-[200] absolute top-12 right-4 bg-slate-900 border-2 border-slate-700 rounded-md shadow-lg p-2`}
      >
        <div className="flex flex-col">
          <button
            className="text-slate-300 hover:bg-slate-700 px-2 py-1 rounded-md"
            onClick={() => {
              if (!window.showOpenFilePicker) {
                window.Toast(
                  "Not supported",
                  "danger",
                  "This feature is not supported in your browser. Please use Chrome or Edge."
                );
                return;
              }
              window
                ?.showOpenFilePicker({ multiple: true })
                ?.then(async (files) => {
                  //for loop async
                  for (let file of files) {
                    //upload
                    let project = globalThis?.localStorage?.getItem("project");
                    let f = await fetch(
                      `http://${localStorage.getItem(
                        "host"
                      )}:${localStorage.getItem(
                        "port"
                      )}/projects/${encodeURIComponent(project)}/new/file`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          content: await file.text(),
                          file: file.name,
                        }),
                      }
                    ).then((res) => res.json());
                    if (f.error) {
                      window.Toast(
                        f.error,
                        "danger",
                        "Failed to upload file: " + file.name
                      );
                    } else {
                      window.Toast(
                        `File Uploaded [${files.indexOf(file) + 1}/${
                          files.length
                        }`,
                        "success",
                        file.name
                      );
                    }
                  }
                });
            }}
          >
            Import File
          </button>
          <button
            className="text-red-600 hover:bg-red-300 px-2 py-1 rounded-md"
            onClick={() => {
              let name = prompt(
                `Enter \`${localStorage.getItem(
                  "project"
                )}\` to confirm. This will DELETE your Project! It's cannot be recovered!`
              );
              if (name === localStorage.getItem("project")) {
                fetch(
                  `http://${localStorage.getItem(
                    "host"
                  )}:${localStorage.getItem(
                    "port"
                  )}/projects/${encodeURIComponent(
                    localStorage.getItem("project")
                  )}`,
                  {
                    method: "DELETE",
                  }
                )
                  .then((res) => res.json())
                  .then((res) => {
                    if (res.error) {
                      window.Toast("Error", "danger", res.error);
                    } else {
                      window.Toast(
                        "Project Deleted",
                        "success",
                        "Your project has been deleted."
                      );
                      setTimeout(() => {
                        localStorage.removeItem("project");
                        router.push("/workspace");
                      }, 1000);
                    }
                  });
              } else {
                window.Toast("Error", "danger", "Project name did not match.");
              }
            }}
          >
            Delete Project
          </button>
        </div>
      </div>
    </>
  );
}
