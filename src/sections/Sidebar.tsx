import { FileAction, useFileState } from "../contexts/FileContext"
import FileList from "../components/FileList";

export default function Sidebar() {
  const { state, dispatch } = useFileState();

  if(state.files.length === 0) {
    return null;
  }

  const onItemClick = (index: number) => {
    dispatch({
      type: FileAction.Select,
      payload: index,
    })
  }

  return <div className="w-full my-8 border-t-2 border-slate-400 overflow-y-scroll">
    <FileList files={state.files} selected={state.selected} onItemSelect={onItemClick}/>
  </div>
}