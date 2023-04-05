var varfileHandle: any;

export type FileSystemFileHandle = {
  getFile: () => any;
  createWritable: () => any;
};

export function setHandle(fileHandle: FileSystemFileHandle) {
  varfileHandle = fileHandle;
}

export function getHandle() {
  return varfileHandle;
}
