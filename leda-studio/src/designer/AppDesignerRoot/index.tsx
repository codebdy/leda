import React, { memo, useMemo } from 'react'
import { DESIGNER_TOKEN_NAME, SERVER_URL } from 'consts'
import { EntiRoot, useToken } from 'enthooks'
import { IApp } from 'model'
import { DesignerRootInner } from './DesignerRootInner'
import { ThemeRoot } from 'designer/ThemeRoot'

const AppDesignerRoot = memo((
  props: {
    children: React.ReactNode,
    app: IApp,
  }
) => {
  const { app } = props;
  const token = useToken();
  const config = useMemo(() => {
    const localStorageToken = localStorage.getItem(DESIGNER_TOKEN_NAME)
    return {
      endpoint: SERVER_URL,
      appId: app.id,
      token: token || localStorageToken,
      tokenName: DESIGNER_TOKEN_NAME,
    }
  }, [app, token])

  return (
    <ThemeRoot>
      <EntiRoot config={config as any} >
        <DesignerRootInner app={app}>
          {props.children}
        </DesignerRootInner>
      </EntiRoot>
    </ThemeRoot>
  )
})

export default AppDesignerRoot;



