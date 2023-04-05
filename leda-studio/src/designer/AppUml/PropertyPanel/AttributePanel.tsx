import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AttributeMeta } from "../meta/AttributeMeta";
import { Types } from "../meta/Type";
import { ClassMeta, StereoType } from "../meta/ClassMeta";
import { useChangeAttribute } from "../hooks/useChangeAttribute";
import { CONST_ID } from "../meta/Meta";
import { useGetTypeLabel } from "../hooks/useGetTypeLabel";
import { Form, Input, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { AttributeTypeInput } from "./AttributeTypeInput";
import { MultiLangInput } from "components/MultiLangInput";
import { isStr } from "@formily/shared";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";

export const AttributePanel = (props: {
  attribute: AttributeMeta;
  cls: ClassMeta;
}) => {
  const { attribute, cls } = props;
  const [nameError, setNameError] = useState<string>();
  const appId = useEdittingAppId();
  const changeAttribute = useChangeAttribute(appId);
  const getTypeLabel = useGetTypeLabel(appId);
  const { t } = useTranslation();
  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields();
  }, [form, attribute.uuid])

  useEffect(() => {
    form.setFieldsValue({ ...attribute });
  }, [attribute, form])

  const isId = useMemo(() => attribute.name === CONST_ID, [attribute.name]);

  const handleChange = useCallback((form: any) => {
    if (form?.length && isStr(form?.length)) {
      form.length = parseInt(form.length)
    }

    const errMsg = changeAttribute(
      {
        ...attribute,
        ...form,
        typeLabel: getTypeLabel(form.type || attribute.type, form.typeUuid),
      },
      cls
    );
    setNameError(errMsg)
  }, [changeAttribute, attribute, getTypeLabel, cls])


  return (
    <div className="property-pannel">
      <Form
        name="attributeForm"
        form={form}
        colon={false}
        labelAlign="left"
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 15 }}
        initialValues={attribute}
        autoComplete="off"
        onValuesChange={handleChange}
      >
        <Form.Item
          label={t("AppUml.Name")}
          name="name"
          validateStatus={nameError ? "error" : undefined}
          help={nameError}
        >
          <Input disabled={isId} />
        </Form.Item>

        {!isId &&
          <Form.Item
            label={t("Label")}
            name="label"
          >
            <MultiLangInput inline title={t("Label")} />
          </Form.Item>
        }

        {cls.stereoType !== StereoType.Enum && (
          <>
            <AttributeTypeInput attribute={attribute} />
            {
              !isId &&
              <>
                <Form.Item
                  label={t("AppUml.Nullable")}
                  valuePropName="checked"
                  name="nullable"
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  label={t("AppUml.Unique")}
                  valuePropName="checked"
                  name="unique"
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  label={t("AppUml.Index")}
                  valuePropName="checked"
                  name="index"
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  label={t("AppUml.HiddenField")}
                  valuePropName="checked"
                  name="hidden"
                >
                  <Switch />
                </Form.Item>
              </>
            }
            {
              attribute.type === Types.Uuid &&
              <Form.Item
                label={t("AppUml.AutoGenerate")}
                valuePropName="checked"
                name="autoGenerate"
              >
                <Switch />
              </Form.Item>
            }
            {
              attribute.type === Types.Int &&
              <Form.Item
                label={t("AppUml.AutoIncrement")}
                valuePropName="checked"
                name="autoIncrement"
              >
                <Switch />
              </Form.Item>
            }
            {
              attribute.type === Types.Date &&
              <>
                <Form.Item
                  label={t("AppUml.CreateDate")}
                  valuePropName="checked"
                  name="createDate"
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  label={t("AppUml.UpdateDate")}
                  valuePropName="checked"
                  name="updateDate"
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  label={t("AppUml.DeleteDate")}
                  valuePropName="checked"
                  name="deleteDate"
                >
                  <Switch />
                </Form.Item>
              </>
            }
            {
              !isId &&
              <>
                <Form.Item
                  label={t("AppUml.DefaultValue")}
                  name="default"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={t("Length")}
                  name="length"
                >
                  <Input type={"number"} />
                </Form.Item>
              </>
            }

          </>
        )}
        <Form.Item
          label={t("AppUml.Description")}
          name="description"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </div>
  );
};
