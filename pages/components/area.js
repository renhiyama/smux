import Controls from "./controls";
import EditorArea from "./editorarea";
import Workspace from "./workspace";
import Settings from "./settings";
import Index from "./index";

export default function Area({ page, children }) {
  let pages = {
    index: <Index />,
    files: (
      <>
        <Controls />
        <EditorArea />
      </>
    ),
    workspace: <Workspace />,
    settings: <Settings />,
  };
  return (
    <div
      id="area"
      page={page}
      key={page}
      className={`ml-[3.2rem] min-h-screen lg:rounded-l-md bg-slate-800 text-slate-300 
    ${page == "files" ? "grid grid-cols-10 transition-all duration-500" : ""}`}
    >
      {pages[page]}
    </div>
  );
}
