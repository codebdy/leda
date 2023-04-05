import { useToken } from "antd/es/theme/internal";
import { memo, useMemo } from "react"
import { ThemeProvider } from "styled-components";

export const StyledThemeRoot = memo((props: {
  children: React.ReactNode
}) => {
  const { children } = props;
  const [, token] = useToken()
  const theme = useMemo(() => {
    return {
      token
    }
  }, [token])
  return (<ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>)
})