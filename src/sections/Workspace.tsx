import FileUpload from "./FileUpload";
import { useFileState } from "../contexts/FileContext";
import Renderer from "./Renderer";

export default function Workspace() {
  const { state } = useFileState();
  return state.files.length > 0 ? (
    <Renderer file={state.files[state.selected]} />
  ) : (
    <FileUpload />
  );
}
