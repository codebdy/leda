import { useToken } from "antd/es/theme/internal"
import React, { memo, useMemo } from "react"

import { ThemeProvider } from "styled-components"

export const ThemeRoot = memo((
  props: {
    children?: React.ReactNode
  }
) => {
  const [, token] = useToken()
  const theme = useMemo(() => {
    return {
      token
    }
  }, [token])

  return (
    <ThemeProvider theme={theme}>
      {props.children}
    </ThemeProvider>
  )
})