import Controls from "./controls";
import EditorArea from "./editorarea";
export default function Area({ page, children }) {
  return (
    <div id="area" page={page} className={`ml-[3.2rem] min-h-screen lg:rounded-l-md bg-slate-800 text-slate-300 
    ${(page=="files")?"grid grid-cols-10 transition-all duration-500":""}`}>
      {(page == "files") ? (
        <>
          <Controls />
          <EditorArea />
        </>
      ) : (<>
        {children}
      </>)}

    </div>
  )
}