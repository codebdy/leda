import React, { useCallback, useEffect, useMemo } from "react";
import {
  RelationMeta,
  RelationMultiplicity,
  RelationType,
} from "../meta/RelationMeta";
import { useClass } from "../hooks/useClass";
import { useChangeRelation } from "../hooks/useChangeRelation";
import { Collapse, Form, Input, Select } from "antd";
import { useTranslation } from "react-i18next";
import { MultiLangInput } from "components/MultiLangInput";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";

const { Panel } = Collapse;
const { Option } = Select;

export const RelationPanel = (props: { relation: RelationMeta }) => {
  const { relation } = props;
  const appId = useEdittingAppId();
  const source = useClass(relation.sourceId, appId);
  const target = useClass(relation.targetId, appId);
  const changeRelation = useChangeRelation(appId);
  const { t } = useTranslation();

  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields();
  }, [form, relation.uuid])

  useEffect(() => {
    form.setFieldsValue(relation);
  }, [form, relation])

  const isInherit = useMemo(
    () => RelationType.INHERIT === relation.relationType,
    [relation.relationType]
  );

  const handleChange = useCallback((values: any) => {
    changeRelation({
      ...relation,
      ...values,
    });
  }, [relation, changeRelation])

  return (
    <div className="property-pannel no-border" style={{ padding: 0 }}>
      {
        isInherit ?
          <div style={{
            width: "100%",
            padding: "8px",
          }}>{t("AppUml.Inherit")}</div>
          : <Form
            name="classForm"
            form={form}
            colon={false}
            labelAlign="left"
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 15 }}
            initialValues={relation}
            autoComplete="off"
            onValuesChange={handleChange}
          >
            <Collapse className="no-border" defaultActiveKey={['1', '2']}>
              <Panel header={source?.name + t("AppUml.Side")} key="1">
                <Form.Item
                  label={t("AppUml.Multiplicity")}
                  name="sourceMutiplicity"
                >
                  <Select>
                    <Option value={RelationMultiplicity.ZERO_ONE}> {RelationMultiplicity.ZERO_ONE}</Option>
                    {relation.relationType !==
                      RelationType.ONE_WAY_COMBINATION &&
                      relation.relationType !==
                      RelationType.TWO_WAY_COMBINATION && (
                        <Option value={RelationMultiplicity.ZERO_MANY}> {RelationMultiplicity.ZERO_MANY}</Option>
                      )}
                  </Select>

                </Form.Item>
                {
                  relation.relationType !== RelationType.ONE_WAY_AGGREGATION &&
                  relation.relationType !== RelationType.ONE_WAY_ASSOCIATION &&
                  relation.relationType !== RelationType.ONE_WAY_COMBINATION &&
                  <>
                    <Form.Item
                      label={t("AppUml.RoleName")}
                      name="roleOfSource"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label={t("Label")}
                      name="labelOfSource"
                    >
                      <MultiLangInput inline title={t("Label")} />
                    </Form.Item>
                    <Form.Item
                      label={t("AppUml.Description")}
                      name="descriptionOnSource"
                    >
                      <Input.TextArea />
                    </Form.Item>
                  </>
                }
              </Panel>
              <Panel header={target?.name + t("AppUml.Side")} key="2">
                <Form.Item
                  label={t("AppUml.Multiplicity")}
                  name="targetMultiplicity"
                >
                  <Select>
                    <Option value={RelationMultiplicity.ZERO_ONE}> {RelationMultiplicity.ZERO_ONE}</Option>
                    <Option value={RelationMultiplicity.ZERO_MANY}> {RelationMultiplicity.ZERO_MANY}</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label={t("AppUml.RoleName")}
                  name="roleOfTarget"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={t("Label")}
                  name="labelOfTarget"
                >
                  <MultiLangInput inline title={t("Label")} />
                </Form.Item>
                <Form.Item
                  label={t("AppUml.Description")}
                  name="descriptionOnTarget"
                >
                  <Input.TextArea />
                </Form.Item>
              </Panel>
              {
                RelationType.INHERIT !== relation.relationType &&
                <Panel header={t("AppUml.Other")} key="3">
                  <Form.Item
                    label={t("AppUml.Type")}
                    name="relationType"
                  >
                    <Select>
                      <Option value={RelationType.TWO_WAY_ASSOCIATION}> {t("AppUml.Association")}</Option>
                      <Option value={RelationType.TWO_WAY_AGGREGATION}> {t("AppUml.Aggregation")}</Option>
                      <Option value={RelationType.TWO_WAY_COMBINATION}> {t("AppUml.Combination")}</Option>
                      <Option value={RelationType.ONE_WAY_ASSOCIATION}> {t("AppUml.OneWanAssociation")}</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label={"InnerId"}
                    name="innerId"
                  >
                    <Input disabled />
                  </Form.Item>
                </Panel>
              }
            </Collapse>

          </Form>
      }
    </div>
  );
};
