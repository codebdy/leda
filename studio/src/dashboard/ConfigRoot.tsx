import { ConfigProvider, theme } from "antd"
import { memo } from "react"
import { useRecoilValue } from "recoil"
import { themeModeState } from "recoil/atoms"

export const ConfigRoot = memo((
  props: {
    children?: React.ReactNode
  }
) => {
  const themeMode = useRecoilValue(themeModeState)
  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      {
        props.children
      }
    </ConfigProvider>
  )
})