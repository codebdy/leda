import { Form, Input, message, Modal, Select } from "antd";
import { memo, useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { useShowError } from "designer/hooks/useShowError";
import { useQueryVersions } from "enthooks/hooks/useQueryVersions";
import { useDesignerParams, useParseLangMessage } from "plugin-sdk";
import { useExportApp } from "enthooks/hooks/useExportApp";
import { ID } from "shared";

const { Option } = Select;


export const ExportDialog = memo((
  props: {
    open?: boolean,
    onOpenChange?: (open?: boolean) => void
  }
) => {
  const { open, onOpenChange } = props;
  const appId = useEdittingAppId();
  const { app } = useDesignerParams();
  const { t } = useTranslation();
  const p = useParseLangMessage();
  const [form] = Form.useForm<{ snapshotId?: ID }>();
  const { snapshots, error: queryError } = useQueryVersions(appId, appId)
  const [exporting, setExporting] = useState(false);
  const snapshotIdRef = useRef<ID>();

  // const save = useSave(() => {
  //   message.success(t("OperateSuccess"));
  //   setExporting(false)
  //   onOpenChange && onOpenChange(false);
  // })


  const [exportApp, { loading, error }] = useExportApp({
    onCompleted: (data) => {
      setExporting(true)
      //onOpenChange(false);
      //message.success(t("Designer.ExportSuccess"));
      if (data?.exportApp) {
        fetch(data?.exportApp).then((resp => {
          resp.arrayBuffer().then((buffer) => {
            //save((p(app.title) || ("app" + appId)) + (snapshots?.find(sn => sn.id === snapshotIdRef.current)?.version || ""), buffer);
          }).catch(err => {
            message.error(err?.message)
            console.error(err)
            setExporting(false)
          })
        })).catch(err => {
          message.error(err?.message)
          console.error(err)
          setExporting(false)
        })
      }

      form.resetFields()
    }
  });

  useShowError(error || queryError)

  const handleOk = useCallback(() => {
    form.validateFields().then((values: { snapshotId?: ID }) => {
      snapshotIdRef.current = values?.snapshotId
      exportApp(values?.snapshotId as any)
    })

  }, [form, exportApp])

  const handleCancel = useCallback(() => {
    form.resetFields();
    onOpenChange && onOpenChange(false);
  }, [onOpenChange, form])

  const handleValueChange = useCallback((changeValues: any) => {
    if (changeValues?.snapshotId) {
      form.setFieldValue("description", snapshots?.find(snapshot => snapshot.id === changeValues?.snapshotId)?.description)
    }
  }, [form, snapshots])
  return (
    <Modal
      title={t("Designer.Export")}
      cancelText={t("Cancel")}
      okText={t("Confirm")}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{
        loading: loading || exporting
      }}
    >
      <Form
        name="makeVersion"
        labelWrap
        initialValues={{ title: "", description: "" }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        form={form}
        autoComplete="off"
        onValuesChange={handleValueChange}
      >
        <Form.Item
          label={t("Designer.VersionNumber")}
          name="snapshotId"
          rules={[{ required: true, message: t("Required") }]}
        >
          <Select >
            {
              snapshots?.map(snapshot => {
                return (
                  <Option key={snapshot.id} value={snapshot.id}>{p(snapshot.version)}</Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          label={t("Description")}
          name="description"
        >
          <Input.TextArea readOnly />
        </Form.Item>
      </Form>
    </Modal>
  )
})