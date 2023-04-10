import { useCallback } from "react";

export async function getTheFiles(accept: string, multiple?: boolean) {
  // open file picker
  const fileHandles = await (window as any).showOpenFilePicker({
    types: [{
      accept: {
        "file/*": accept?.split(",")
      },
    }],
    excludeAcceptAllOption: false,
    multiple: multiple,
  });

  return fileHandles;
}

export function useAppOpenFile() {
  const open = useCallback(async () => {
    const fileHandles = await getTheFiles(".zip", false)
    const files = await fileHandles.map(async (fileHandle: any) => {
      return await fileHandle.getFile();
    })
    return files?.[0]
  }, [])

  return open;
}