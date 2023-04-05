import { useTranslation } from "react-i18next";

export function useBundleTranslations(ns: string) {
  const { i18n } = useTranslation();
  return useTranslation(i18n.hasResourceBundle(i18n.language, ns) ? ns : undefined)
}