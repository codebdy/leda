import React, { useCallback, useMemo } from "react"
import { memo } from "react"
import { IComponentAuthConfig, IPage, IPageCategory } from "model";
import { IDevice } from "designer/hooks/useDevices"
import { Table } from "antd";
import { useColumns } from "./useColumns";
import { ID } from "shared";
import { IUiAuthRow } from "../IUiAuthConfig";
import { useParseLangMessage } from "plugin-sdk";
import { usePagesWithoutCategory } from "../hooks/usePagesWithoutCategory";
import { useAuthCategories } from "../hooks/useAuthCategories";
import { useAuthPages } from "../hooks/useAuthPages";
import { IAuthCategory, IAuthComponent, IAuthPage } from "../hooks/model";

export const PageAuthPanal = memo((
  props: {
    device: IDevice,
    categories: IPageCategory[],
    pages: IPage[],
    roleId: ID,
    componentConfigs: IComponentAuthConfig[],
  }
) => {
  const { device, categories, pages, roleId, componentConfigs } = props;
  const columns = useColumns(roleId);
  const p = useParseLangMessage();
  const authPages = useAuthPages(pages);
  const pagesWithoutCategory = usePagesWithoutCategory(authPages, categories);
  const authCategories = useAuthCategories(categories, authPages);

  const makeComponentItem = useCallback((com: IAuthComponent, pageId: ID) => {
    return {
      key: pageId + com.name,
      componentId: com.name,
      name: p(com.title),
      componentConfig: componentConfigs.find(config => config.componentId === com.name),
      device: device.key as any
    }
  }, [p, componentConfigs, device])

  const makePageItem = useCallback((page: IAuthPage) => {
    return {
      key: page.page.id,
      name: p(page.page.title),
      children: page.components.map(com => makeComponentItem(com, page.page.id)),
      device: device.key as any
    }
  }, [p, device.key, makeComponentItem])

  const makeCategoryItem = useCallback((category: IAuthCategory) => {
    return {
      key: category.category.uuid,
      name: p(category.category.title),
      children: category.pages.map(page => makePageItem(page)),
      device: device.key as any
    }
  }, [p, device, makePageItem])

  const data: IUiAuthRow[] = useMemo(() => {
    const categoryItems = authCategories.map(category => makeCategoryItem(category))
    const pageItems = pagesWithoutCategory.map(page => makePageItem(page))
    return [...categoryItems, ...pageItems]
  }, [authCategories, makeCategoryItem, pagesWithoutCategory, makePageItem])

  return (
    <Table
      columns={columns}
      dataSource={data || []}
      pagination={false}
    />
  )
})