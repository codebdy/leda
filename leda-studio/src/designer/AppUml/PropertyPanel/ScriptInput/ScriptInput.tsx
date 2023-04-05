import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Space } from "antd"
import { useCallback, useState } from "react"
import { memo } from "react"
import { useTranslation } from "react-i18next";
import "./style.less";

export const ScriptInput = memo((
  props: {
    value?: string,
    onChange?: (value?: string) => void,
  }
) => {
  const { value, onChange } = props;
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  const showModal = useCallback(() => {
    setOpen(true)
  }, [])

  const handleOk = useCallback(() => {
    setOpen(false);
  }, [])

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, [])

  const handleChange = useCallback((valueStr?: string) => {
    onChange && onChange(valueStr)
  }, [onChange])
  return (
    <>
      <Button block onClick={showModal}>
        {t("AppUml.ConfigScript")}
      </Button>
      <Modal
        className="script-input-modal"
        title={t("AppUml.ConfigScript")}
        width={800}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t("Confirm")}
        cancelText={t("Cancel")}
        footer={
          <div className="footer-toolbar">
            <Button icon={<PlayCircleOutlined />}>
              {t("Test")}
            </Button>
            <Space>
              <Button onClick={handleCancel}>
                {t("Cancel")}
              </Button>
              <Button type="primary" onClick={handleOk}>
                {t("Confirm")}
              </Button>
            </Space>
          </div>
        }
      >
        <div className="input-modal-body">
          {/* <MonacoInput
            className="script-input-area"
            options={{
              readOnly: false,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 0,
              // minimap: {
              //   enabled: false,
              // }
            }}
            language="javascript"
            theme="dark"
            helpLink=""
            value={value}
            onChange={handleChange}
          /> */}
        </div>
      </Modal>
    </>
  )
})