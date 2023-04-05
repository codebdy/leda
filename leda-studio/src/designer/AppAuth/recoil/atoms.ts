import { atom } from "recoil";
import { IRole } from "model";

export const authRolesState = atom<IRole[]>({
  key: "authRoles",
  default: [],
})
