import React, { memo, useCallback, useEffect, useState } from "react";
import { useGetTypeLabel } from "../hooks/useGetTypeLabel";
import { Form } from "antd";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { MethodFormCommonItems } from "./MethodPanel/MethodFormCommonItems";
import { OrchestrationMeta } from "../meta/OrchestrationMeta";
import { useChangeOrchestration } from "../hooks/useChangeOrchestration";

export const OrchestrationPanel = memo((props: { orchestration: OrchestrationMeta; }) => {
  const { orchestration } = props;
  const [nameError, setNameError] = useState<string>();
  const appId = useEdittingAppId();
  const changeOrchestration = useChangeOrchestration(appId);
  const getTypeLabel = useGetTypeLabel(appId);
  const [form] = Form.useForm()

  useEffect(
    () => {
      form.setFieldsValue({ ...orchestration });
    },
    [orchestration, form]
  )

  const handleChange = useCallback((form: any) => {
    const errMsg = changeOrchestration(
      {
        ...orchestration,
        ...form,
        typeLabel: getTypeLabel(form.type || orchestration.type, form.typeUuid),
      }
    );
    setNameError(errMsg)
  }, [changeOrchestration, orchestration, getTypeLabel])

  return (
    <div className="property-pannel">
      <Form
        name="orchestrationForm"
        form={form}
        colon={false}
        labelAlign="left"
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 15 }}
        initialValues={orchestration}
        autoComplete="off"
        onValuesChange={handleChange}
      >
        <MethodFormCommonItems nameError={nameError} method={orchestration} />
      </Form>
    </div>
  );
});
