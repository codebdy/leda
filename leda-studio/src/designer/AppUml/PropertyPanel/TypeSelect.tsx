import { Select } from "antd"
import React, { useCallback } from "react"
import { memo } from "react"
import { useTranslation } from "react-i18next";
import { Type, Types } from "../meta";
const { Option } = Select;

export const TypeSelect = memo((
  props: {
    disabled?: boolean,
    value?: Type,
    onChange?: (value?: Type) => void,
    noEntity?: boolean,
    style?: React.CSSProperties,
  }
) => {
  const { value, disabled, onChange, noEntity, style } = props
  const { t } = useTranslation();

  const handleChange = useCallback((value:any) => {
    onChange && onChange(value)
  }, [onChange])

  return (
    <Select style={style} value={value} disabled={disabled} onChange={handleChange}>
      <Option value={Types.ID}>ID</Option>
      <Option value={Types.Int}>Int</Option>
      <Option value={Types.Float}>Float</Option>
      <Option value={Types.Boolean}>Boolean</Option>
      <Option value={Types.String}>String</Option>
      <Option value={Types.Date}>Date</Option>
      <Option value={Types.Uuid}>UUID</Option>
      <Option value={Types.Enum}>{t("AppUml.Enum")}</Option>
      <Option value={Types.JSON}>JSON</Option>
      <Option value={Types.ValueObject}>{t("AppUml.ValueClass")}</Option>
      {
        !noEntity &&
        <Option value={Types.Entity}>{t("AppUml.Entity")}</Option>
      }
      <Option value={Types.File}>{t("File")}</Option>
      <Option value={Types.Password}>{t("Password")}</Option>
      <Option value={Types.IDArray}>ID {t("AppUml.Array")}</Option>
      <Option value={Types.IntArray}>Int {t("AppUml.Array")}</Option>
      <Option value={Types.FloatArray}>Float {t("AppUml.Array")}</Option>
      <Option value={Types.StringArray}>String {t("AppUml.Array")}</Option>
      <Option value={Types.DateArray}>Date {t("AppUml.Array")}</Option>
      <Option value={Types.EnumArray}>
        {t("AppUml.Enum")}
        {t("AppUml.Array")}
      </Option>
      <Option value={Types.JSONArray}>
        {"JSON"}
        {t("AppUml.Array")}
      </Option>
      <Option value={Types.ValueObjectArray}>
        {t("AppUml.ValueClass")}
        {t("AppUml.Array")}
      </Option>
      {
        !noEntity &&
        <Option value={Types.EntityArray}>
          {t("AppUml.Entity")}
          {t("AppUml.Array")}
        </Option>
      }
    </Select>
  )
})