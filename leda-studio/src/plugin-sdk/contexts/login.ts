import { createContext, useContext } from "react";
import { IUser } from "enthooks/hooks/useQueryMe";

export const UserContext = createContext<IUser | undefined>(undefined);

export function useMe(){
  return useContext(UserContext);
}