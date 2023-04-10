import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { x6NodesState } from "../recoil/atoms";

export function useGetDiagramNode(appId: ID) {
  const nodes = useRecoilValue(x6NodesState(appId));

  const getNode = useCallback(
    (uuid: string, diagramUuid: string) => {
      return nodes.find(
        (node) => node.id === uuid && node.diagramUuid === diagramUuid
      );
    },
    [nodes]
  );

  return getNode;
}
