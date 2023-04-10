import { Form, Select } from "antd";
import React, { useMemo } from "react"
import { memo } from "react"
import { useTranslation } from "react-i18next";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { useEntities } from "../hooks/useEntities";
import { useEnums } from "../hooks/useEnums";
import { useValueObjects } from "../hooks/useValueObjects";
import { Type, Types } from "../meta"
const { Option } = Select;

export const TypeUuidSelect = memo((
  props: {
    type?: Type,
    withFormItem?: boolean,
    value?: string,
    onChange?: (value?: string) => void,
    style?: React.CSSProperties,
  }
) => {
  const { type, withFormItem, value, onChange, style } = props;
  const appId = useEdittingAppId();
  const enums = useEnums(appId);
  const valueObjects = useValueObjects(appId);
  const entities = useEntities(appId);
  const { t } = useTranslation();

  const [title, classes] = useMemo(() => {
    if (type === Types.Enum ||
      type === Types.EnumArray) {
      return [t("AppUml.EnumClass"), enums]
    }

    if (type === Types.ValueObject ||
      type === Types.ValueObjectArray) {
      return [t("AppUml.ValueClass"), valueObjects]
    }

    if (type === Types.Entity ||
      type === Types.EntityArray) {
      return [t("AppUml.EntityClass"), entities]
    }

    return []
  }, [type, t, enums, valueObjects, entities])

  return (
    classes ? (
      withFormItem
        ?
        <Form.Item
          label={title}
          name="typeUuid"
        >
          <Select style={style}>
            <Option key="" value="">
              <em>None</em>
            </Option>
            {classes.map((cls) => {
              return (
                <Option key={cls.uuid} value={cls.uuid}>{cls.name}</Option>
              );
            })}
          </Select>
        </Form.Item>
        :
        <Select style={style} value={value} onChange={onChange}>
          <Option key="" value="">
            <em>None</em>
          </Option>
          {classes.map((cls) => {
            return (
              <Option key={cls.uuid} value={cls.uuid}>{cls.name}</Option>
            );
          })}
        </Select>
    )
    :<></>
  )
})