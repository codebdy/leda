import { atom } from "recoil";
import { IApp } from "../model";

export const appsState = atom<IApp[]>({
  key: "apps",
  default: [],
})

export const appsLoadingState = atom<boolean>({
  key: "appsLoading",
  default: false,
})

export const themeModeState = atom<'light' | 'dark'>({
  key: "themeMode",
  default: 'dark',
})