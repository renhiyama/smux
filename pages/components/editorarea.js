import { useEffect } from 'react';
export default function EditorArea({ }) {
  useEffect(() => {
    let editor = ace.edit("editor");
    ace.config.set('basePath', '/');
    editor.setShowPrintMargin(false);
    editor.setTheme("ace/theme/one_dark");
    editor.session.setMode("ace/mode/javascript");
    return()=>{
      editor.destroy();
    }
  })
  return (
    <>
      <div id="workarea" className="flex flex-col h-full lg:col-span-8 bg-slate-800">
        <div className="mx-auto py-8 border-b border-slate-700 bg-slate-900 w-full"></div>
        <div id="editor" className="mx-auto h-full w-full">
          console.log("hello world");
        </div>
        <div className="mt-auto mx-auto py-4 border-t border-slate-700 bg-slate-900 w-full"></div>
      </div>
    </>
  )
}