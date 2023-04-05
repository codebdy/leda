import { TranslationOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { useParseLangMessage } from "plugin-sdk/hooks/useParseLangMessage";
import { useDesignerAppConfig } from "plugin-sdk/contexts/desinger";
import ResourceEditDialog from "./ResourceEditDialog";

export interface IMultiLangInputProps{
  multiline?: boolean,
  onChange?: (value?: string) => void,
  value?: string,
  inline?: boolean,
  title?: string,
  rows?: number,
  onClick?: (event: React.MouseEvent<any>) => void,
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void,
}

export const MultiLangInput = (
  props: IMultiLangInputProps
) => {
  const { multiline, onChange, onKeyUp, onClick, value, inline, title, rows, ...other } = props;
  const appConfig = useDesignerAppConfig();
  const [visiable, setVisiable] = useState(false);
  const parse = useParseLangMessage();

  const handleOpen = useCallback(() => {
    setVisiable(true)
  }, [])

  const handleClose = useCallback(() => {
    setVisiable(false)
  }, [])

  const InputCtrl = useMemo(() => multiline ? Input.TextArea : Input, [multiline]);

  const isMultLang = appConfig?.schemaJson?.multiLang?.open;

  const parsedValue = useMemo(() => parse(value), [parse, value]);

  const handleDiaglogChange = useCallback((value?: string) => {
    onChange && onChange(value)
    //onModalOkClose && onModalOkClose()
  }, [onChange])

  const hanldeCInputCtrlChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange && onChange(event.target.value)
  }, [onChange])

  return (
    <>
      <Input.Group compact {...other}>
        <InputCtrl
          onClick={onClick}
          style={{ width: isMultLang ? 'calc(100% - 32px)' : "100%" }}
          rows={rows}
          onKeyUp={onKeyUp as any}
          value={parsedValue}
          onChange={hanldeCInputCtrlChange} />
        {
          isMultLang &&
          <Button icon={<TranslationOutlined />} style={{ width: "32px" }} onClick={handleOpen}></Button>
        }

      </Input.Group>
      <ResourceEditDialog
        visiable={visiable}
        multiline={multiline}
        value={value}
        inline={inline}
        title={title}
        onClose={handleClose}
        onChange={handleDiaglogChange}
      />
    </>
  )
}
