import React, { memo, useCallback, useEffect, useState } from "react";
import { MethodMeta } from "../../meta/MethodMeta";
import { ClassMeta } from "../../meta/ClassMeta";
import { useChangeMethod } from "../../hooks/useChangeMethod";
import { useGetTypeLabel } from "../../hooks/useGetTypeLabel";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { ScriptInput } from "../ScriptInput/ScriptInput";
import { MethodFormCommonItems } from "./MethodFormCommonItems";

export const MethodPanel = memo((props: { method: MethodMeta; cls: ClassMeta }) => {
  const { method, cls } = props;
  const [nameError, setNameError] = useState<string>();
  const appId = useEdittingAppId();
  const changeMethod = useChangeMethod(appId);
  const getTypeLabel = useGetTypeLabel(appId);
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(
    () => {
      form.setFieldsValue({ ...method });
    },
    [method, form]
  )

  const handleChange = useCallback((form: any) => {
    const errMsg = changeMethod(
      {
        ...method,
        ...form,
        typeLabel: getTypeLabel(form.type || method.type, form.typeUuid),
      },
      cls
    );
    setNameError(errMsg)
  }, [changeMethod, method, getTypeLabel, cls])

  return (
    <div className="property-pannel">
      <Form
        name="attributeForm"
        form={form}
        colon={false}
        labelAlign="left"
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 15 }}
        initialValues={method}
        autoComplete="off"
        onValuesChange={handleChange}
      >
        <MethodFormCommonItems nameError={nameError} method={method} />
        <Form.Item
          label={t("AppUml.Script")}
          name="script"
        >
          <ScriptInput />
        </Form.Item>
      </Form>
    </div>
  );
});
