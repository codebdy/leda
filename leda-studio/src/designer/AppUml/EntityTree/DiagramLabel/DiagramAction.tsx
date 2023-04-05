import { MoreOutlined, EditOutlined, DeleteOutlined, LockOutlined } from "@ant-design/icons";
import { Dropdown, Button } from "antd";
import { memo, useCallback } from "react"
import { useTranslation } from "react-i18next";
import { DiagramMeta } from "../../meta/DiagramMeta";
import { useGetPackage } from "../../hooks/useGetPackage";
import { useDeleteDiagram } from "../../hooks/useDeleteDiagram";
import { SYSTEM_APP_ID } from "consts";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";

const DiagramAction = memo((
  props: {
    diagram: DiagramMeta,
    onEdit: () => void,
    onVisibleChange: (visible: boolean) => void,
  }
) => {
  const { diagram, onEdit, onVisibleChange } = props;
  const appId = useEdittingAppId();
  const getPagcage = useGetPackage(appId)
  const deleteDiagram = useDeleteDiagram(appId)
  const { t } = useTranslation();

  const handleDelete = useCallback(() => {
    deleteDiagram(diagram.uuid)
    onVisibleChange(false);
  }, [deleteDiagram, onVisibleChange, diagram.uuid]);


  return (
    getPagcage(diagram.packageUuid)?.sharable && appId !== SYSTEM_APP_ID ?
      <Button type="text" shape='circle' size='small' style={{ color: "inherit" }}>
        <LockOutlined />
      </Button>
      :
      <Dropdown
        menu={{
          items: [
            {
              icon: <EditOutlined />,
              label: t("Edit"),
              key: '6',
              onClick: e => {
                e.domEvent.stopPropagation();
                onEdit();
                onVisibleChange(false);
              }
            },
            {
              icon: <DeleteOutlined />,
              label: t("Delete"),
              key: '7',
              onClick: e => {
                e.domEvent.stopPropagation();
                handleDelete();
                onVisibleChange(false);
              }
            },
          ]
        }}
        onOpenChange={onVisibleChange}
        trigger={['click']}
      >
        <Button type="text" shape='circle' size='small' onClick={e => e.stopPropagation()} style={{ color: "inherit" }}>
          <MoreOutlined />
        </Button>
      </Dropdown>
  )
})

export default DiagramAction;