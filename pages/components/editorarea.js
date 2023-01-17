import { use, useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function EditorArea({}) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
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
    let editor = ace.edit("editor");
    window.editor = editor;
    ace.config.set(
      "basePath",
      "https://cdn.jsdelivr.net/npm/ace-builds@1.14.0/src-min-noconflict"
    );
    editor.setShowPrintMargin(false);
    editor.setTheme("ace/theme/one_dark");
    editor.session.setMode("ace/mode/javascript");
    editor.session.setUseWrapMode(true);
    editor.session.setUseSoftTabs(true);
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
          editor.setValue(res.content);
          editor.gotoLine(1);
          editor.setAnimatedScroll(true);
          editor.resize();
        });
    }
    document.getElementById("editor").classList.remove("hidden");
    let inter;
    let resize;
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
    resize = setInterval(() => {
      editor.resize();
    }, 100);
    return () => {
      editor.destroy();
      clearInterval(inter);
      clearInterval(resize);
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
    return () => {
      window.removeEventListener("resize", resizeListen);
    };
  }, [controlsOpen]);
  let toggleControls = function () {
    setControlsToggle(!controlsOpen);
    if (controlsOpen) window?.editor?.resize();
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
        <div className="flex mx-auto py-2 lg:py-8 border-b border-slate-700 bg-slate-900 w-full">
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
                let $ = document.getElementById("editor");
                $.classList.toggle("hidden");
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
        </div>
        <div id="editor" className="mx-auto h-full w-full hidden"></div>
        <div className="mt-auto mx-auto py-4 px-4 border-t border-slate-700 bg-slate-900 w-full">
          <p>Yo</p>
        </div>
      </div>
    </>
  );
}
