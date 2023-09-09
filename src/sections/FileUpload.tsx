import { FileAction, useFileState } from "../contexts/FileContext";
import { parse } from "@zombrodo/tim-parser";

async function parseFile(file: File) {
  const buffer = await file.arrayBuffer();
  const data = parse(buffer);
  return {
    file,
    data,
  };
}

export default function FileUpload() {
  const { dispatch } = useFileState();
  const onFileUpload = (files: FileList | null) => {
    if (files) {
      Promise.all([...files].map(parseFile)).then((data) =>
        dispatch({
          type: FileAction.Add,
          payload: data,
        })
      );
    }
  };

  return (
    <div className="p-4 w-full h-full">
      <div
        className={`w-full h-full flex flex-col gap-2 items-center justify-center`}
      >
        <h2 className="text-2xl italic">Drag and drop your files here</h2>
        <label
          htmlFor="file-upload"
          className="italic underline cursor-pointer"
        >
          Or click here to open the file browser
        </label>
        <input
          id="file-upload"
          type="file"
          hidden
          multiple
          onChange={(evt) => onFileUpload(evt.target.files)}
        />
      </div>
    </div>
  );
}
