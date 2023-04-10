import { useCallback } from "react";
import { IPage } from "model";
import { IAuthComponent } from "./model";
import { useParseSchema } from "./useParseSchema";

export function useParsePageComponents() {
  const p = useParseSchema();
  const parse = useCallback((page: IPage): IAuthComponent[] => {
    return p(page.schemaJson?.schema);
  }, [p])

  return parse;
}