import { getHandle, setHandle } from "./FileHandlers";

export const pickerTypes = [
  {
    accept: {
      "text/json": [".json"],
    },
  },
];


export async function saveFile(name: string, content: string) {
  const handle = getHandle();
  // create a new handle
  try{
    const newHandle =  handle || await (window as any).showSaveFilePicker({
      suggestedName: name + ".json",
      types: pickerTypes,
    });

    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();

    // write our file
    await writableStream.write(content);

    // close the file and write the contents to disk.
    await writableStream.close();

    setHandle(newHandle);    

    return newHandle.name;
  }
  catch(error){
    console.error(error);
    return false;
  }
 
}
