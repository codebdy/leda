import { useMemo } from "react";
import { IPageCategory } from "model";
import { IAuthPage } from "./model";

export function usePagesWithoutCategory(pages:IAuthPage[], categories :IPageCategory[]) {
  const pagesWithoutCategory = useMemo(() => {
    const pgs = [];
    for (const page of pages || []) {
      if (!categories.find(category => category.uuid === page.page.categoryUuid)) {
        pgs.push(page)
      }
    }

    return pgs;
  }, [categories, pages])

  return pagesWithoutCategory;
}