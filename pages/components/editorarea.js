import { useEffect, useState } from 'react';
export default function EditorArea({ }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/ace-builds@1.14.0/src-min-noconflict/ace.min.js";
    script.onload = () => { setLoaded(true); };
    document.body.appendChild(script);
  }, []);
  useEffect(() => {
    if(!loaded) return;
    let editor = ace.edit("editor");
    ace.config.set('basePath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.14.0/src-min-noconflict');
    editor.setShowPrintMargin(false);
    editor.setTheme("ace/theme/one_dark");
    editor.session.setMode("ace/mode/javascript");
    document.getElementById("editor").classList.remove("hidden");
    return()=>{
      editor.destroy();
    }
  }, [loaded]);
  return (
    <>
      <div id="workarea" className="flex flex-col h-full lg:col-span-8 bg-slate-800">
        <div className="mx-auto py-8 border-b border-slate-700 bg-slate-900 w-full"></div>
        <div id="editor" className="mx-auto h-full w-full hidden">
          console.log("hello world");
        </div>
        <div className="mt-auto mx-auto py-4 border-t border-slate-700 bg-slate-900 w-full"></div>
      </div>
    </>
  )
}