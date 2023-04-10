import { useMemo } from "react";
import { useQueryApp } from "designer/hooks/useQueryApp";
import { ID } from "shared";
import dayjs from "dayjs";

export function usePublished(appId: ID) {
  const { app } = useQueryApp(appId)

  const published = useMemo(() => {
    if (!app) {
      return false;
    }

    if (app.publishMetaAt && (dayjs(app?.saveMetaAt).diff(dayjs(app?.publishMetaAt)) <= 0)) {
      return true;
    }

    if (!app.saveMetaAt) {
      return true;
    }
    if (!app.publishMetaAt && app.saveMetaAt) {
      return false;
    }
  }, [app])


  return published;
}