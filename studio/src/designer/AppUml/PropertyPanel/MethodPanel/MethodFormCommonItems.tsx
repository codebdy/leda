import { Form, Input, Radio } from "antd";
import React from "react";
import { memo } from "react"
import { useTranslation } from "react-i18next";
import { MultiLangInput } from "components/MultiLangInput";
import { MethodMeta, MethodOperateType } from "../../meta";
import { ArgsInput } from "./ArgsInput/ArgsInput";
import { MethodTypeInput } from "./MethodTypeInput";

export const MethodFormCommonItems = memo((
  props: {
    nameError?: string,
    method: MethodMeta,
  }
) => {
  const { nameError, method } = props;
  const { t } = useTranslation();

  return (
    <>
      <Form.Item
        label={t("AppUml.Name")}
        name="name"
        validateStatus={nameError ? "error" : undefined}
        help={nameError}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("Label")}
        name="label"
      >
        <MultiLangInput inline title={t("Label")} />
      </Form.Item>
      <Form.Item
        label={t("AppUml.OperateType")}
        name="operateType"
      >
        <Radio.Group
          optionType="button"
          options={[
            {
              value: MethodOperateType.Query,
              label: t("AppUml.Query"),
            },
            {
              value: MethodOperateType.Mutation,
              label: t("AppUml.Mutation"),
            }
          ]}
        />
      </Form.Item>
      <MethodTypeInput method={method} />
      <Form.Item
        label={t("AppUml.Arguments")}
        name="args"
      >
        <ArgsInput />
      </Form.Item>
      <Form.Item
        label={t("Description")}
        name="description"
      >
        <MultiLangInput multiline inline title={t("Description")} />
      </Form.Item>
    </>
  )
})