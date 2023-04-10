export function formatFileSize(fileSize: number) {
  if (fileSize < 1024) {
    return fileSize + ' bytes';
  } else if (fileSize < (1024 * 1024)) {
    var temp: any = fileSize / 1024;
    temp = temp.toFixed(2);
    return temp + 'KB';
  } else if (fileSize < (1024 * 1024 * 1024)) {
    var temp: any = fileSize / (1024 * 1024);
    temp = temp.toFixed(2);
    return temp + 'MB';
  } else {
    var temp: any = fileSize / (1024 * 1024 * 1024);
    temp = temp.toFixed(2);
    return temp + 'GB';
  }
}