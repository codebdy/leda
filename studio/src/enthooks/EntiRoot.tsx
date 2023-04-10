import React, { useCallback, useEffect, useState } from "react"
import { memo } from "react"
import { empertyConfig, EntixContext, IEntxConfig } from "./context"

export const EntiRoot = memo((
  props: {
    config: {
      token?: string;
      endpoint: string;
      appId?: string;
      tokenName: string;
    },
    children: React.ReactNode,
  }
) => {
  const { config, children } = props;
  const [value, setValue] = useState<IEntxConfig>()
  const setToken = useCallback((token: string | undefined) => {
    setValue((config) => ({ ...config, token } as any))
  }, [])

  const setEndpoint = useCallback((endpoint: string | undefined) => {
    setValue((config) => ({ ...config, endpoint } as any))
  }, [])

  useEffect(() => {
    setValue({
      ...config,
      setToken,
      setEndpoint
    })
  }, [config, setEndpoint, setToken])

  return (
    <EntixContext.Provider value={value || empertyConfig}>
      {
        children
      }
    </EntixContext.Provider>
  )
})