import { useMemo } from "react";
import { IPage } from "model";
import { IAuthPage } from "./model";
import { useParsePageComponents } from "./useParsePageComponents";

export function useAuthPages(pages: IPage[]) {
  const parse = useParsePageComponents();
  const authPages = useMemo(() => {
    const pgs: IAuthPage[] = []
    for (const page of pages) {
      const coms = parse(page)
      if (coms.length > 0) {
        pgs.push({
          page,
          components: coms,
        })
      }
    }

    return pgs;

  }, [pages, parse])
  return authPages;
}