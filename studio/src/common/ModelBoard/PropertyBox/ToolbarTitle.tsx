import React from 'react';

export default function ToolbarTitle(props: {
  children?: any,
}) {
  return (
    <div style={{
      marginLeft: "8px",
      fontSize: '0.95rem',
      //color: theme.palette.text.primary,
    }}>
      {props.children}
    </div>
  )
}
