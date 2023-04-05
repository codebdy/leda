import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { SYSTEM_APP_ID } from "consts";
import { ID } from "shared";
import { classesState, relationsState, diagramsState, x6NodesState, x6EdgesState, packagesState, codesState, orchestrationsState } from "../recoil/atoms";

export function useGetMeta(appId: ID) {
  const packages = useRecoilValue(packagesState(appId))
  const classes = useRecoilValue(classesState(appId));
  const relations = useRecoilValue(relationsState(appId));
  const diagrams = useRecoilValue(diagramsState(appId));
  const codes = useRecoilValue(codesState(appId));
  const orchestrations = useRecoilValue(orchestrationsState(appId));
  const x6Nodes = useRecoilValue(x6NodesState(appId));
  const x6Edges = useRecoilValue(x6EdgesState(appId));
  const getMeta = useCallback(() => {
    const pkgs = packages.filter(pgk => !pgk.sharable || appId === SYSTEM_APP_ID)
    const clses = classes.filter(cls => pkgs.find(pkg => cls.packageUuid === pkg.uuid))
    const relns = relations.filter(relation => {
      const sourceClass = clses.find(cls => cls.uuid === relation.sourceId)
      return !!sourceClass
    })
    const diagms = diagrams.filter(diagram => pkgs.find(pkg => pkg.uuid === diagram.packageUuid))
    const content = {
      packages: pkgs,
      classes: clses,
      relations: relns,
      diagrams: diagms,
      codes: codes,
      orchestrations,
      x6Nodes,
      x6Edges,
    };

    return content;
  }, [appId, classes, diagrams, codes, orchestrations, packages, relations, x6Edges, x6Nodes]);

  return getMeta
}