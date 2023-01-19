import { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { detectLang } from "../utils/detectLang";
import Image from "next/image";
export default function EditorArea({}) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [currentFile, setCurrentFile] = useState("");
  useEffect(() => {
    setCurrentFile(globalThis?.localStorage?.getItem("currentFile"));
  }, [globalThis?.localStorage?.getItem("currentFile")]);
  useEffect(() => {
    let script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/ace-builds@1.14.0/src-min-noconflict/ace.min.js";
    script.onload = () => {
      setLoaded(true);
    };
    document.body.appendChild(script);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    if (!localStorage.getItem("project")) return;
    fetch(
      `http://${localStorage.getItem("host")}:${localStorage.getItem("port")}/`
    ).catch(() => {
      //move to /workspace
      router.push("/workspace");
      return;
    });
    let editor = ace.edit("editor", {
      cursorStyle: "smooth",
      showInvisibles: true,
      autoScrollEditorIntoView: true,
    });
    window.editor = editor;
    ace.config.set(
      "basePath",
      "https://cdn.jsdelivr.net/npm/ace-builds@1.14.0/src-min-noconflict"
    );
    editor.setShowPrintMargin(false);
    editor.setTheme("ace/theme/one_dark");
    if (detectLang(localStorage.getItem("currentFile"))) {
      editor.session.setMode(
        `ace/mode/${
          detectLang(currentFile) == "js"
            ? "javascript"
            : detectLang(currentFile)
        }`
      );
    }
    editor.session.setUseWrapMode(true);
    editor.session.setUseSoftTabs(true);
    editor.setReadOnly(true);
    if (localStorage.getItem("currentFile")) {
      fetch(
        `http://${localStorage.getItem("host")}:${localStorage.getItem(
          "port"
        )}/projects/${encodeURIComponent(
          localStorage.getItem("project")
        )}/file/${encodeURIComponent(localStorage.getItem("currentFile"))}`
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            return;
          }
          //check if content is over 512kb
          if (res.content.length > 524288) {
            //show error
            window.Toast(
              "File is too large to open",
              "error",
              "We can't open files larger than 512kb. Consider splitting your codes!"
            );
            localStorage.removeItem("currentFile");
            return router.push("/workspace");
          }
          editor.session.setValue(res.content);
          editor.gotoLine(1);
          editor.setAnimatedScroll(true);
          editor.resize();
          editor.setReadOnly(false);
        });
    }
    document.getElementById("editor").classList.remove("hidden");
    let inter;
    if (
      localStorage.getItem("currentFile") &&
      localStorage.getItem("project")
    ) {
      inter = setInterval(() => {
        if (localStorage.getItem("currentFile")) {
          //save contents of editor to server
          fetch(
            `http://${localStorage.getItem("host")}:${localStorage.getItem(
              "port"
            )}/projects/${encodeURIComponent(
              localStorage.getItem("project")
            )}/file/${encodeURIComponent(localStorage.getItem("currentFile"))}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: editor.getValue(),
              }),
            }
          );
        }
      }, 5000);
    }
    return () => {
      editor.destroy();
    };
  }, [loaded]);
  //toggleControls with react
  const [controlsOpen, setControlsToggle] = useState(true);
  useEffect(() => {
    let mobileScreen = () => {
      return Math.min(window.screen.width, window.screen.height) < 800;
    };
    let whatisnow = mobileScreen();
    let cp = document.getElementById("controls");
    let area = document.getElementById("area");
    let nav = document.getElementById("nav");
    controlsOpen ? cp.classList.add("hidden") : cp.classList.remove("hidden");
    let wa = document.getElementById("workarea");
    controlsOpen
      ? wa.classList.remove("lg:col-span-8")
      : wa.classList.add("lg:col-span-8");
    //fix for mobile screens
    if (mobileScreen()) {
      //we opened control screen, so we will hide editor ;)
      //!controlsOpen = we currently opened controls
      if (!controlsOpen) {
        wa.classList.remove("col-span-10");
        wa.classList.add("col-span-2");
        wa.classList.add("brightness-50");
        area.classList.add("ml-[3.2rem]");
        nav.classList.remove("hidden");
      } else {
        area.classList.remove("ml-[3.2rem]");
        wa.classList.remove("col-span-2");
        wa.classList.remove("brightness-50");
        wa.classList.add("col-span-10");
        nav.classList.add("hidden");
      }
    }
    let resizeListen = function () {
      //reset to default
      if (whatisnow != mobileScreen()) {
        router.push("/fakerefresh");
      }
    };
    window.addEventListener("resize", resizeListen);
    let resize = () => {
      try {
        if (controlsOpen) {
          editor.resize();
        }
      } catch (e) {}
    };
    setInterval(resize, 500);
    return () => {
      window.removeEventListener("resize", resizeListen);
      clearInterval(resize);
    };
  }, [controlsOpen]);
  let toggleControls = function () {
    setControlsToggle(!controlsOpen);
  };
  let toggleControlsIfDark = function (e) {
    //stop propagation if el has brightness-50 class
    let el = document.getElementById("workarea");
    if (el.classList.contains("brightness-50")) {
      e.stopPropagation();
      toggleControls();
    }
  };
  return (
    <>
      <div
        id="workarea"
        className="flex flex-col h-full col-span-10 lg:col-span-8 bg-slate-800"
        onClick={toggleControlsIfDark}
      >
        <div className="flex mx-auto lg:py-4 border-b border-slate-700 bg-slate-900 w-full">
          <button onClick={toggleControls} className="p-4 lg:hidden">
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
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <div className={`${controlsOpen ? "" : "hidden"} my-auto`}>
            <button
              onClick={() => {
                let e = document.getElementById("editor");
                e.classList.toggle("hidden");
                e = document.getElementById("Econtrols");
                e.classList.toggle("hidden");
                editor.resize();
              }}
              className="py-4"
            >
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
                  d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                />
              </svg>
            </button>
          </div>
          <span className="flex my-auto mx-2">
            <Image
              src={`/fileicons/file_type_${detectLang(currentFile)}.svg`}
              width={20}
              height={20}
              alt="file icon"
            />
          </span>
        </div>
        <div id="editor" className="mx-auto h-full w-full hidden"></div>
        <div
          id="Econtrols"
          className={`${
            controlsOpen ? "" : "hidden"
          } flex mt-auto mx-auto py-2 lg:py-4 px-1 border-t border-slate-700 bg-black w-full`}
        >
          <button
            name="tab"
            className="px-2 py-1"
            onClick={() => {
              navigator.vibrate([50]);
              editor.insert("\t");
              editor.focus();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 -rotate-90"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </button>
          <button
            name="move-up"
            className="px-2 py-1"
            onClick={() => {
              navigator.vibrate([50]);
              editor.moveCursorTo(
                editor.getCursorPosition().row - 1,
                editor.getCursorPosition().column
              );
              editor.focus();
            }}
          >
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
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
              />
            </svg>
          </button>
          <button
            name="move-right"
            className="px-2 py-1"
            onClick={() => {
              navigator.vibrate([50]);
              editor.moveCursorTo(
                editor.getCursorPosition().row + 1,
                editor.getCursorPosition().column
              );
              editor.session.selection.clearSelection();
              editor.focus();
            }}
          >
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
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          <button
            name="move-left"
            className="px-2 py-1"
            onClick={() => {
              navigator.vibrate([50]);
              editor.moveCursorTo(
                editor.getCursorPosition().row,
                editor.getCursorPosition().column - 1
              );
              editor.session.selection.clearSelection();
              editor.focus();
            }}
          >
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
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            name="move-right"
            className="px-2 py-1"
            onClick={() => {
              navigator.vibrate([50]);
              editor.moveCursorTo(
                editor.getCursorPosition().row,
                editor.getCursorPosition().column + 1
              );
              editor.session.selection.clearSelection();
              editor.focus();
            }}
          >
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
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
          <button
            name="blur"
            className="px-2 py-1"
            onClick={() => {
              editor.blur();
              setTimeout(() => {
                editor.resize();
              }, 500);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.28 2.22a.75.75 0 00-1.06 1.06L5.44 6.5H2.75a.75.75 0 000 1.5h4.5A.75.75 0 008 7.25v-4.5a.75.75 0 00-1.5 0v2.69L3.28 2.22zM13.5 2.75a.75.75 0 00-1.5 0v4.5c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-2.69l3.22-3.22a.75.75 0 00-1.06-1.06L13.5 5.44V2.75zM3.28 17.78l3.22-3.22v2.69a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.69l-3.22 3.22a.75.75 0 101.06 1.06zM13.5 14.56l3.22 3.22a.75.75 0 101.06-1.06l-3.22-3.22h2.69a.75.75 0 000-1.5h-4.5a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0v-2.69z" />
            </svg>
          </button>
          <button
            name="undo"
            className="px-2 py-1"
            onClick={() => {
              navigator.vibrate([50]);
              document.execCommand("undo", false, null);
              editor.session.selection.clearSelection();
              editor.focus();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            name="redo"
            className="px-2 py-1"
            onClick={() => {
              navigator.vibrate([50]);
              document.execCommand("redo", false, null);
              editor.session.selection.clearSelection();
              editor.focus();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M12.207 2.232a.75.75 0 00.025 1.06l4.146 3.958H6.375a5.375 5.375 0 000 10.75H9.25a.75.75 0 000-1.5H6.375a3.875 3.875 0 010-7.75h10.003l-4.146 3.957a.75.75 0 001.036 1.085l5.5-5.25a.75.75 0 000-1.085l-5.5-5.25a.75.75 0 00-1.06.025z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            name="home"
            className="px-2 py-1"
            onClick={() => {
              navigator.vibrate([50]);
              editor.moveCursorTo(editor.getCursorPosition().row, 0);
              editor.session.selection.clearSelection();
              editor.focus();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            name="end"
            className="px-2 py-1 rotate-180"
            onClick={() => {
              navigator.vibrate([50]);
              editor.moveCursorTo(
                editor.getCursorPosition().row,
                editor.session.getLine(editor.getCursorPosition().row).length
              );
              editor.session.selection.clearSelection();
              editor.focus();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
