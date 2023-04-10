import { Form, Modal, Select } from "antd"
import { memo, useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { PackageMeta, PackageStereoType } from "../../meta/PackageMeta"
import { MultiLangInput } from "components/MultiLangInput"
const { Option } = Select;

export const PackageDialog = memo((
  props: {
    open?: boolean,
    pkg: PackageMeta,
    onClose: () => void,
    onConfirm: (pkg: PackageMeta) => void,
  }
) => {
  const { open, pkg, onClose, onConfirm } = props;
  const [form] = Form.useForm<PackageMeta>();
  useEffect(() => {
    form.setFieldsValue(pkg)
  }, [form, pkg])
  const { t } = useTranslation();

  const handleConfirm = useCallback(() => {
    form.validateFields().then(changeValues => {
      onConfirm({ ...pkg, ...changeValues })
    })
  }, [form, onConfirm, pkg])


  return (
    <Modal
      title={t("AppUml.PackageInfo")}
      open={open}
      cancelText={t("Cancel")}
      okText={t("Confirm")}
      onCancel={onClose}
      onOk={handleConfirm}
      centered
      wrapProps={
        {
          onClick: (e: any) => {
            e.stopPropagation()
          },
        }
      }
    >
      <Form
        name="editPackage"
        labelWrap
        initialValues={{ title: "", description: "" }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        form={form}
        autoComplete="off"
      >
        <Form.Item
          label={t("Name")}
          name="name"
          rules={[{ required: true, message: t("Required") }]}
        >
          <MultiLangInput inline title={t("Name")} />
        </Form.Item>

        < Form.Item
          label={t("AppUml.StereoType")}
          name="stereoType"
        >
          <Select defaultValue={PackageStereoType.Normal}>
            <Option value={PackageStereoType.Normal}>{t("AppUml.NormPackage")}</Option>
            <Option value={PackageStereoType.ThirdParty}>{t("AppUml.ThirdPartyPackage")}</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
})