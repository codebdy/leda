import { MoreOutlined, EditOutlined, DeleteOutlined, FileAddOutlined, PlusSquareOutlined, ShareAltOutlined, LockOutlined, StopOutlined } from "@ant-design/icons";
import { Dropdown, Button } from "antd";
import { memo, useCallback, useMemo, useState } from "react"
import { useSetRecoilState } from 'recoil';
import { classesState, diagramsState, selectedUmlDiagramState } from "../../recoil/atoms";
import { PackageMeta } from "../../meta/PackageMeta";
import { useDeletePackage } from '../../hooks/useDeletePackage';
import { useCreateNewClass } from "../../hooks/useCreateNewClass";
import { useCreateNewDiagram } from "../../hooks/useCreateNewDiagram";
import { StereoType } from "../../meta/ClassMeta";
import { useBackupSnapshot } from "../../hooks/useBackupSnapshot";
import { useTranslation } from "react-i18next";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { useChangePackage } from "../../hooks/useChangePackage";
import { SYSTEM_APP_ID } from "consts";
import { DiagramMeta } from "../../meta/DiagramMeta";
import { DiagramDialog } from "../DiagramLabel/DiagramDialog";

const PackageAction = memo((
  props: {
    pkg: PackageMeta,
    onEdit: () => void,
    onVisibleChange: (visible: boolean) => void,
  }
) => {
  const { pkg, onEdit, onVisibleChange } = props;
  const appId = useEdittingAppId();
  const [newDiagram, setNewDiagram] = useState<DiagramMeta>();
  const deletePackage = useDeletePackage(appId)
  const createNewClass = useCreateNewClass(appId);
  const createNewDiagram = useCreateNewDiagram(appId);
  const setClasses = useSetRecoilState(classesState(appId));
  const backupSnapshot = useBackupSnapshot(appId);
  const setDiagrams = useSetRecoilState(diagramsState(appId));
  const { t } = useTranslation();

  const updatePackage = useChangePackage();

  const setSelectedDiagram = useSetRecoilState(
    selectedUmlDiagramState(appId)
  );

  const handleDelete = useCallback(() => {
    deletePackage(pkg.uuid)
    onVisibleChange(false);
  }, [deletePackage, onVisibleChange, pkg.uuid]);

  const addClass = useCallback(
    (stereoType: StereoType) => {
      backupSnapshot();
      const newClass = createNewClass(stereoType, pkg.uuid);
      setClasses((classes) => [...classes, newClass]);
      onVisibleChange(false);
    },
    [backupSnapshot, createNewClass, onVisibleChange, pkg.uuid, setClasses]
  );

  const handleAddDiagram = useCallback(
    () => {
      setNewDiagram(createNewDiagram(pkg.uuid));
    },
    [createNewDiagram, pkg.uuid]
  );

  const handleShare = useCallback(() => {
    backupSnapshot();
    updatePackage({ ...pkg, sharable: true });
  }, [backupSnapshot, pkg, updatePackage]);

  const handleCancelShare = useCallback(() => {
    backupSnapshot();
    updatePackage({ ...pkg, sharable: false });
  }, [backupSnapshot, pkg, updatePackage]);

  const handleClose = useCallback(() => {
    setNewDiagram(undefined)
  }, []);

  const handleConfirm = useCallback((diagram: DiagramMeta) => {
    backupSnapshot();
    setDiagrams((diams) => [...diams, diagram]);
    setSelectedDiagram(diagram.uuid);
    setNewDiagram(undefined);
  }, [backupSnapshot, setDiagrams, setSelectedDiagram]);


  const shareItems = useMemo(() => {
    return appId === SYSTEM_APP_ID
      ? [
        pkg?.sharable
          ?
          {
            icon: <StopOutlined />,
            label: t("CancelShare"),
            key: '5',
            onClick: (e: any) => {
              e.domEvent.stopPropagation();
              onVisibleChange(false);
              handleCancelShare();
            }
          }
          :
          {
            icon: <ShareAltOutlined />,
            label: t("Share"),
            key: '5',
            onClick: (e: any) => {
              e.domEvent.stopPropagation();
              onVisibleChange(false);
              handleShare();
            }
          }
        ,
      ]
      : []
  }, [appId, pkg?.sharable, t, onVisibleChange, handleCancelShare, handleShare])


  return (
    pkg.sharable && appId !== SYSTEM_APP_ID ?
      <Button type="text" shape='circle' size='small'>
        <LockOutlined />
      </Button>
      :
      <>
        <Dropdown
          menu={{
            items: [
              {
                icon: <FileAddOutlined />,
                label: t("AppUml.AddDiagram"),
                key: '0',
                onClick: e => {
                  e.domEvent.stopPropagation();
                  handleAddDiagram();
                }
              },
              {
                icon: <PlusSquareOutlined />,
                label: t("AppUml.AddClass"),
                key: '1',
                onClick: e => e.domEvent.stopPropagation(),
                children: [
                  {
                    label: t("AppUml.AddEntity"),
                    key: '1',
                    onClick: e => {
                      e.domEvent.stopPropagation();
                      addClass(StereoType.Entity);
                    },
                  },
                  {
                    label: t("AppUml.AddAbstract"),
                    key: '2',
                    onClick: e => {
                      e.domEvent.stopPropagation();
                      addClass(StereoType.Abstract);
                    },
                  },
                  {
                    label: t("AppUml.AddEnum"),
                    key: '3',
                    onClick: e => {
                      e.domEvent.stopPropagation();
                      addClass(StereoType.Enum);
                    },
                  },
                  {
                    label: t("AppUml.AddValueObject"),
                    key: '4',
                    onClick: e => {
                      e.domEvent.stopPropagation();
                      addClass(StereoType.ValueObject);
                    },
                  },
                  // {
                  //   label: t("AppUml.AddThirdParty"),
                  //   key: '5',
                  //   onClick: e => {
                  //     e.domEvent.stopPropagation();
                  //     addClass(StereoType.ThirdParty);
                  //   },
                  // },
                  // {
                  //   label: t("AppUml.AddService"),
                  //   key: '6',
                  //   onClick: e => {
                  //     e.domEvent.stopPropagation();
                  //     addClass(StereoType.Service);
                  //   },
                  // },
                ]
              },
              ...shareItems,
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
          <Button type="text" shape='circle' size='small' onClick={e => e.stopPropagation()}>
            <MoreOutlined />
          </Button>
        </Dropdown>
        {
          newDiagram &&
          <DiagramDialog
            diagram={newDiagram}
            open={!!newDiagram}
            onClose={handleClose}
            onConfirm={handleConfirm}
          />
        }

      </>
  )
})

export default PackageAction;