import { FileAction, useFileState } from "../contexts/FileContext";
import { onFileUpload } from "../utils/tim";

export default function FileUpload() {
  const { dispatch } = useFileState();
  const onUpload = onFileUpload((files) =>
    dispatch({ type: FileAction.Add, payload: files })
  );

  return (
    <div className="p-4 w-full">
      <div className={`w-full flex flex-col gap-2 items-center justify-center`}>
        <h2 className="text-2xl italic">Drag and drop your files here</h2>
        <label htmlFor="file-upload" className="underline text-orangered-400">
          or Browse
        </label>
        <input
          id="file-upload"
          type="file"
          hidden
          multiple
          onChange={(evt) => onUpload(evt.target.files)}
        />
      </div>
    </div>
  );
}
