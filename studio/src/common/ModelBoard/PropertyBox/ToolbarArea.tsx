import React from 'react';

export default function ToolbarArea(props: {
  children?: any
}) {
  return (
    <div className="bottom-border" style={{
      display: 'flex',
      width: '100%',
      height: '40px',
      //borderBottom: `solid 1px ${theme.palette.divider}`,
      alignItems: 'center',
    }}>
      {props.children}
    </div>
  )
}
