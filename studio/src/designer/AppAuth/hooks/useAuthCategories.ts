import { useMemo } from "react";
import { IPageCategory } from "model";
import { IAuthPage } from "./model";
import { useGetCategoryPages } from "./useGetCategoryPages";

export function useAuthCategories(categories: IPageCategory[], authPages: IAuthPage[]) {
  const getPages = useGetCategoryPages(authPages);
  const authCategories = useMemo(() => {
    const athCats = [];
    for (const category of categories) {
      const pgs = getPages(category.uuid);
      if (pgs.length > 0) {
        athCats.push({
          category,
          pages: pgs,
        })
      }
    }
    return athCats;
  }, [categories, getPages])

  return authCategories;
}