import Controls from "./controls";
import EditorArea from "./editorarea";
import Workspace from "./workspace";
export default function Area({ page, children }) {
  let pages = {
    "files": <>
      <Controls />
      <EditorArea />
    </>,
    "workspace": <>
      <Workspace />
    </>
  }
  return (
    <div id="area" page={page} className={`ml-[3.2rem] min-h-screen lg:rounded-l-md bg-slate-800 text-slate-300 
    ${(page == "files") ? "grid grid-cols-10 transition-all duration-500" : ""}`}>
      {pages[page]}
    </div>
  )
}