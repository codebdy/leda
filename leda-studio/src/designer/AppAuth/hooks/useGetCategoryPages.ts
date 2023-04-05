import { useCallback } from "react";
import { ID } from "shared";
import { IAuthPage } from "./model";

export function useGetCategoryPages(pages: IAuthPage[]) {
  const getPages = useCallback((categoryUuid?: ID) => {
    return pages?.filter(page => page.page.categoryUuid === categoryUuid)
  }, [pages]);

  return getPages
}