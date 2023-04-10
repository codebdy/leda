import { useCallback } from "react";
import { IOpenFileAction } from "plugin-sdk";

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

export function useOpenFile() {
  const open = useCallback(async (palyload: IOpenFileAction, variables: any) => {
    try {
      const allFiles = await Promise.all(
        (await getTheFiles(palyload.accept as any, palyload.multiple)).map(async (fileHandle:any) => {
          const file = await fileHandle.getFile();
          return file;
        })
      );

      if (palyload.multiple) {
        variables[palyload.variableName as any] = allFiles
      } else {
        variables[palyload.variableName as any] = allFiles?.[0]
      }
    } catch (err) {
      console.error(err)
      //中断动作链，但是不显示错误信息
      // eslint-disable-next-line no-throw-literal
      throw undefined
    }

  }, [])

  return open;
}