import { Collapse, Empty, Form } from "antd"
import React, { useCallback, useEffect } from "react"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import { useAssignment } from "../hooks/useAssignment"
import { useElementView } from "./elements"
import { DocumentItem } from "./items/DocumentItem"
import { IdItem } from "./items/IdItem"
import { NameItem } from "./items/NameItem"
import "./style.less"

const { Panel } = Collapse;

export const PropertyPanel = memo((props: {
  element?: any,
  modeler?: any,
}) => {
  const { element, modeler } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const elementView = useElementView(element, modeler);
  const [assignment, updateAssignment] = useAssignment(element, modeler);
  useEffect(() => {
    form.setFieldValue("id", element?.businessObject?.id || '')
    form.setFieldValue("name", element?.businessObject?.name || '')
    form.setFieldValue("documentation", element?.businessObject?.documentation || '')
    form.setFieldValue("assignee", assignment?.assignee);
    form.setFieldValue("candidateGroups", assignment?.candidateGroups);
  }, [element?.businessObject, assignment, form])
  console.log("Element的 businessObject", element?.businessObject)

  const handleValueChange = useCallback((changedValue:any) => {
    const modeling = modeler.get('modeling');
    if (changedValue?.name) {
      //modeling.updateLabel(element, changedValue.name);
      modeling.updateProperties(element, { name: changedValue?.name })
    } else if (changedValue?.documentation) {
      modeling.updateProperties(element, { documentation: changedValue?.documentation })
    } else if (changedValue?.id) {
      modeling.updateProperties(element, { id: changedValue?.id })
    } else if (changedValue.assignee) {
      updateAssignment("assignee", changedValue.assignee)
    } else if (changedValue.candidateGroups) {
      updateAssignment("candidateGroups", changedValue.candidateGroups)
    } else {
      modeling.updateProperties(element, changedValue)
    }
  }, [modeler, element, updateAssignment])

  return (
    <div className="property-pannel-form" key={element?.id}>
      <Form
        name="taskform"
        labelCol={{ span: 8 }}
        labelAlign="left"
        layout="vertical"
        wrapperCol={{ span: 24 }}
        form={form}
        autoComplete="off"
        size="small"
        onValuesChange={handleValueChange}
      >
        {
          elementView ?
            <>
              <div className="element-summary">
                <div className="element-icon">
                  {elementView.icon}
                </div>
                <div className="element-text">
                  <div className="element-type">
                    {elementView.type}
                  </div>
                  {
                    elementView?.name !== false &&
                    <div className="element-name">
                      {elementView.name}
                    </div>
                  }
                </div>
              </div>
              <Collapse defaultActiveKey={['general']} expandIconPosition="end">
                <Panel header={t("AppBpmn.General")} key="general">
                  <IdItem />
                  {
                    elementView?.name !== false &&
                    <NameItem />
                  }
                </Panel>
                {
                  elementView?.itemGroups?.map((item) => {
                    return (
                      <Panel header={item.title} key={item.key}>
                        {item.items}
                      </Panel>
                    )
                  })
                }
                <Panel header={t("AppBpmn.Documentation")} key="document">
                  <DocumentItem />
                </Panel>
              </Collapse>
            </>
            : <Empty />
        }

      </Form>
    </div>
  )
})