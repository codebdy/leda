import React, { useCallback, useEffect, useState } from "react";
import { memo } from "react";
import { useBackupSnapshot } from "../../hooks/useBackupSnapshot";
import TreeNodeLabel from "common/TreeNodeLabel";
import { useSetRecoilState } from 'recoil';
import { diagramsState } from '../../recoil/atoms';
import { DiagramMeta } from "../../meta/DiagramMeta";
import DiagramAction from "./DiagramAction";
import { useGetPackage } from "../../hooks/useGetPackage";
import { SYSTEM_APP_ID } from "consts";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { useParseLangMessage } from "plugin-sdk";
import { DiagramDialog } from "./DiagramDialog";

const DiagramLabel = memo((
  props: {
    diagram: DiagramMeta
  }
) => {
  const { diagram } = props;
  const [name, setName] = useState(diagram.name);
  const [editing, setEditing] = useState(false);
  const [visible, setVisible] = useState(false);
  const p = useParseLangMessage();
  const appId = useEdittingAppId();
  const backup = useBackupSnapshot(appId);
  const setDiagrams = useSetRecoilState(diagramsState(appId));
  const getPagcage = useGetPackage(appId)

  useEffect(() => {
    setName(diagram.name)
  }, [diagram])

  const handleVisableChange = useCallback((visible: any) => {
    setVisible(visible)
  }, []);

  const handleEdit = useCallback(() => {
    setEditing(true);
  }, []);

  const handleConfirm = useCallback((diagram?: DiagramMeta) => {
    backup()
    setEditing(false);
    setDiagrams(diagrams => diagrams.map(dm => dm.uuid === diagram?.uuid ? diagram : dm) as any)
  }, [backup, setDiagrams]);


  const handleClose = useCallback(() => {
    setEditing(false);
  }, [])

  return (
    <TreeNodeLabel
      fixedAction={visible || (getPagcage(diagram.packageUuid)?.sharable && appId !== SYSTEM_APP_ID)}
      action={
        !editing ?
          <DiagramAction diagram={diagram}
            onEdit={handleEdit}
            onVisibleChange={handleVisableChange} /> : undefined
      }
      onClick={e => editing ? e.stopPropagation() : undefined}
    >
      <div>{p(name)}</div>
      {
        editing &&
        <DiagramDialog
          open={editing}
          diagram={diagram}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      }
    </TreeNodeLabel>
  )
})

export default DiagramLabel;