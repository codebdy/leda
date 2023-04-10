import { v4 as uuidv4 } from 'uuid';

var idSeed = new Date().getTime()
export type ID = string;

export function createId(): ID {
  idSeed = new Date().getTime()
  return idSeed + ""
}

export const createUuid = () => {
  return uuidv4();
};

export const stringToObj = (str?: string) => {
  if (!str) {
    return {}
  }

  const obj = JSON.parse(str);

  return obj;
}

export const objToString = (obj?: any) => {
  if (!obj) {
    return obj;
  }

  return JSON.stringify(obj);
}

export const httpPrefix = (url: string) => {
  return url.startsWith("https://") ? "https://" : "http://"
}