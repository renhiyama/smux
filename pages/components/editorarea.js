import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/router'

export default function EditorArea({ }) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/ace-builds@1.14.0/src-min-noconflict/ace.min.js";
    script.onload = () => { setLoaded(true); };
    document.body.appendChild(script);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    let editor = ace.edit("editor");
    ace.config.set('basePath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.14.0/src-min-noconflict');
    editor.setShowPrintMargin(false);
    editor.setTheme("ace/theme/one_dark");
    editor.session.setMode("ace/mode/javascript");
    document.getElementById("editor").classList.remove("hidden");
    return () => {
      editor.destroy();
    }
  }, [loaded]);
  //toggleControls with react
  const [controlsOpen, setControlsToggle] = useState(false);
  useEffect(() => {
    let mobileScreen = () => { return (Math.min(window.screen.width, window.screen.height) < 800) };
    let whatisnow = mobileScreen();
    let cp = document.getElementById("controls");
    let area = document.getElementById("area");
    let nav = document.getElementById("nav");
    (controlsOpen) ? cp.classList.add("hidden") : cp.classList.remove("hidden");
    let wa = document.getElementById("workarea");
    (controlsOpen) ? wa.classList.remove("lg:col-span-8") : wa.classList.add("lg:col-span-8");
    console.log(controlsOpen ? "unhide" : "hide");
    //fix for mobile screens
    if (mobileScreen()) {
      //we opened control screen, so we will hide editor ;)
      //!controlsOpen = we currently opened controls
      if (!controlsOpen) {
        console.log("show controls");
        wa.classList.remove("col-span-10");
        wa.classList.add("col-span-2");
        wa.classList.add("brightness-50");
        area.classList.add("ml-[3.2rem]");
        nav.classList.remove("hidden");
      }
      else {
        console.log("show editor");
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
    }
    window.addEventListener("resize", resizeListen);
    return () => {
      window.removeEventListener("resize", resizeListen);
    }
  }, [controlsOpen]);
  let toggleControls = function () {
    setControlsToggle(!controlsOpen);
  }
  let toggleControlsIfDark = function (e) {
    //stop propagation if el has brightness-50 class
    console.log("clicked");
    let el = document.getElementById("workarea");
    if (el.classList.contains("brightness-50")) {
      console.log("touched");
      e.stopPropagation();
      toggleControls();
    }
  }
  return (
    <>
      <div id="workarea" className="flex flex-col h-full col-span-10 lg:col-span-8 bg-slate-800"
        onClick={toggleControlsIfDark}>
        <div className="mx-auto py-2 lg:py-8 border-b border-slate-700 bg-slate-900 w-full">
          <button onClick={toggleControls} className="p-4 lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div id="editor" className="mx-auto h-full w-full hidden">
          console.log("hello world");
        </div>
        <div className="mt-auto mx-auto py-4 border-t border-slate-700 bg-slate-900 w-full"></div>
      </div>
    </>
  )
}