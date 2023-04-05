import { styleLocales } from "./styleLocales";

export const commonLocales = {
  'zh-CN': {
    props: {
      cursor: "光标",
      onClick: '鼠标点击',
      'component-tab':"组件",
      'component-group': '组件属性',
      'component-style-group': '组件样式',
      style: styleLocales['zh-CN']
    },
  },
  'en-US': {
    props: {
      cursor: "Cursor",
      onClick: "on Click",
      style: styleLocales['en-US']
    },
  },
}
