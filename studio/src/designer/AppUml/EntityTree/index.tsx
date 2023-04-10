import { memo, useCallback, useMemo, } from "react";
import { Graph } from "@antv/x6";
import { Tree } from "antd";
import SvgIcon from "common/SvgIcon";
import { ModelRootAction } from "./ModelRootAction";
import { useRecoilState, useRecoilValue } from 'recoil';
import { packagesState, diagramsState, classesState, selectedUmlDiagramState, selectedElementState, codesState, orchestrationsState } from './../recoil/atoms';
import TreeNodeLabel from "common/TreeNodeLabel";
import PackageLabel from "./PackageLabel";
import { PackageMeta } from "../meta/PackageMeta";
import { ClassMeta, StereoType } from "../meta/ClassMeta";
import { ClassIcon } from "./svgs";
import { useIsDiagram } from "../hooks/useIsDiagram";
import { useIsElement } from "../hooks/useIsElement";
import ClassLabel from "./ClassLabel";
import { AttributeMeta } from './../meta/AttributeMeta';
import { useParseRelationUuid } from "../hooks/useParseRelationUuid";
import { useGetSourceRelations } from './../hooks/useGetSourceRelations';
import { useGetTargetRelations } from './../hooks/useGetTargetRelations';
import { useGetClass } from "../hooks/useGetClass";
import { MethodMeta, MethodOperateType } from "../meta/MethodMeta";
import AttributeLabel from "./AttributeLabel";
import { PRIMARY_COLOR, SYSTEM_APP_ID } from "consts";
import MethodLabel from "./MethodLabel";
import AttributesLabel from "./AttributesLabel";
import MethodsLabel from "./MethodsLabel";
import RelationLabel from "./RelationLabel";
import { useTranslation } from "react-i18next";
import PlugIcon from "icons/PlugIcon";
import DiagramLabel from "./DiagramLabel";
import { useParams } from "react-router-dom";
import { CodeMeta } from "../meta/CodeMeta";
import CodeLabel from "./CodeLabel";
import { CodeOutlined, FunctionOutlined } from "@ant-design/icons";
import { useIsCode } from "../hooks/useIsCode";
import { OrchestrationRootAction } from "./OrchestrationRootAction";
import { useSelectedCode } from "../hooks/useSelectedCode";
import { OrchestrationMeta } from "../meta/OrchestrationMeta";
import { OrchestrationLabel } from "./OrchestrationLabel";
import { useSelectedOrcherstration } from "../hooks/useSelectedOrcherstration";
import { useIsOrchestration } from "../hooks/useIsOrchestration";
import { DataNode } from "antd/es/tree";
import styled from "styled-components";
const { DirectoryTree } = Tree;

const Container = styled.div`
  flex: 1;
  overflow: auto;
  padding: 8;
  .ant-tree-node-content-wrapper{
    display: flex;
    .ant-tree-title{
      flex:1;
  }
}
`

export const EntityTree = memo((props: { graph?: Graph }) => {
  const { graph } = props;
  const { appId = SYSTEM_APP_ID } = useParams();
  const packages = useRecoilValue(packagesState(appId));
  const diagrams = useRecoilValue(diagramsState(appId));
  const classes = useRecoilValue(classesState(appId));
  const codes = useRecoilValue(codesState(appId));
  const orchestrations = useRecoilValue(orchestrationsState(appId));
  const isDiagram = useIsDiagram(appId);
  const isElement = useIsElement(appId);
  const isCode = useIsCode(appId);
  const isOrches = useIsOrchestration(appId);
  const parseRelationUuid = useParseRelationUuid(appId);
  const [selectedDiagramId, setSelecteDiagramId] = useRecoilState(selectedUmlDiagramState(appId));
  const [selectedElement, setSelectedElement] = useRecoilState(selectedElementState(appId));
  const getSourceRelations = useGetSourceRelations(appId);
  const getTargetRelations = useGetTargetRelations(appId);
  const getClass = useGetClass(appId);
  const { t } = useTranslation();

  const getAttributeNode = useCallback((attr: AttributeMeta) => {
    return {
      icon: <SvgIcon>
        <svg
          style={{ width: "12px", height: "12px" }}
          viewBox="0 0 24 24"
        >
          <path
            fill={selectedElement === attr.uuid ? PRIMARY_COLOR : undefined}
            d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12Z"
          />
        </svg>
      </SvgIcon>,
      title: <AttributeLabel attr={attr} />,
      key: attr.uuid,
      isLeaf: true,
    }
  }, [selectedElement]);

  const getClassAttributesNode = useCallback((cls: ClassMeta) => {
    return {
      title: <AttributesLabel cls={cls} />,
      key: cls.uuid + "attributes",
      children: cls.attributes.map(attr => getAttributeNode(attr))
    }
  }, [getAttributeNode])

  const getClassRelationsNode = useCallback((cls: ClassMeta) => {
    const children = [];
    const sourceRelations = getSourceRelations(cls.uuid);
    const targetRelations = getTargetRelations(cls.uuid);
    const icon = (color?: string) => <SvgIcon>
      <svg style={{ width: "12px", height: "12px" }} viewBox="0 0 24 24" fill={color || "currentColor"}>
        <path
          fill={color || "currentColor"}
          d="M22 13V19H21L19 17H11V9H5L3 11H2V5H3L5 7H13V15H19L21 13Z"
        /></svg>
    </SvgIcon>;
    for (const relation of sourceRelations) {
      children.push(
        {
          icon: icon(selectedElement === relation.uuid ? PRIMARY_COLOR : undefined),
          title: <RelationLabel
            title={relation.roleOfTarget + ":" + getClass(relation.targetId)?.name}
            relation={relation}
          />,
          key: cls.uuid + "," + relation.uuid,
          isLeaf: true,
        }
      )
    }
    for (const relation of targetRelations) {
      children.push(
        {
          icon: icon(selectedElement === relation.uuid ? PRIMARY_COLOR : undefined),
          title: <RelationLabel
            title={relation.roleOfSource + ":" + getClass(relation.sourceId)?.name}
            relation={relation}
          />,
          key: cls.uuid + "," + relation.uuid,
          isLeaf: true,
        }
      )
    }
    return {
      title: t("AppUml.Relationships"),
      key: cls.uuid + "relations",
      children: children,
    }
  }, [getClass, getSourceRelations, getTargetRelations, selectedElement, t])

  const getMethodNode = useCallback((method: MethodMeta) => {
    return {
      icon: <SvgIcon>
        <svg style={{ width: "12px", height: "12px" }} viewBox="0 0 24 24" fill="currentColor">
          <path fill={selectedElement === method.uuid ? PRIMARY_COLOR : undefined} d="M16 7V3H14V7H10V3H8V7C7 7 6 8 6 9V14.5L9.5 18V21H14.5V18L18 14.5V9C18 8 17 7 16 7M16 13.67L13.09 16.59L12.67 17H11.33L10.92 16.59L8 13.67V9.09C8 9.06 8.06 9 8.09 9H15.92C15.95 9 16 9.06 16 9.09V13.67Z" />
        </svg>
      </SvgIcon>,
      title: <MethodLabel method={method} />,
      key: method.uuid,
      isLeaf: true,
    }
  }, [selectedElement]);
  const getClassMethodsNode = useCallback((cls: ClassMeta) => {
    return {
      title: <MethodsLabel cls={cls} />,
      key: cls.uuid + "methods",
      children: cls.methods?.map(method => getMethodNode(method)),
    }
  }, [getMethodNode])

  const getClassNode = useCallback((cls: ClassMeta) => {
    const children = [];
    if (cls.stereoType !== StereoType.Service) {
      children.push(getClassAttributesNode(cls))
    }
    if (cls.stereoType === StereoType.Abstract ||
      cls.stereoType === StereoType.Entity ||
      cls.stereoType === StereoType.Service) {
      children.push(getClassMethodsNode(cls))
    }

    if (cls.stereoType === StereoType.Entity) {
      const relations = getClassRelationsNode(cls);
      relations.children?.length > 0 && children.push(relations)
    }
    const color = selectedElement === cls.uuid ? PRIMARY_COLOR : undefined;
    return {
      icon: cls.root ?
        <PlugIcon size={"14px"} color={color} />
        : <SvgIcon><ClassIcon color={color} /></SvgIcon>,
      title: <ClassLabel cls={cls} graph={graph} />,
      key: cls.uuid,
      children: children,
    }
  }, [selectedElement, graph, getClassAttributesNode, getClassMethodsNode, getClassRelationsNode])

  const getClassCategoryNode = useCallback((title: string, key: string, clses: ClassMeta[]) => {
    return {
      title: title,
      key: key,
      children: clses.map(cls => getClassNode(cls))
    }
  }, [getClassNode])

  const getCodeNode = useCallback((code: CodeMeta) => {
    return {
      title: <CodeLabel code={code} />,
      key: code.uuid,
      isLeaf: true,
      icon: <CodeOutlined />
    }
  }, [])

  const getCodesNode = useCallback((title: string, key: string) => {
    return {
      title: title,
      key: key,
      children: codes.map(code => getCodeNode(code))
    }
  }, [getCodeNode, codes])

  const getPackageChildren = useCallback((pkg: PackageMeta) => {
    const packageChildren: DataNode[] = []
    const abstracts = classes.filter(cls => cls.stereoType === StereoType.Abstract && cls.packageUuid === pkg.uuid)
    const entities = classes.filter(cls => cls.stereoType === StereoType.Entity && cls.packageUuid === pkg.uuid)
    const enums = classes.filter(cls => cls.stereoType === StereoType.Enum && cls.packageUuid === pkg.uuid)
    const valueObjects = classes.filter(cls => cls.stereoType === StereoType.ValueObject && cls.packageUuid === pkg.uuid)
    const thirdParties = classes.filter(cls => cls.stereoType === StereoType.ThirdParty && cls.packageUuid === pkg.uuid)
    // const services = classes.filter(cls => cls.stereoType === StereoType.Service && cls.packageUuid === pkg.uuid)
    // const pgkCodes = codes.filter(code => code.packageUuid === pkg.uuid)

    if (abstracts.length > 0) {
      packageChildren.push(getClassCategoryNode(t("AppUml.AbstractClass"), pkg.uuid + "abstracts", abstracts))
    }
    if (entities.length > 0) {
      packageChildren.push(getClassCategoryNode(t("AppUml.EntityClass"), pkg.uuid + "entities", entities))
    }
    if (enums.length > 0) {
      packageChildren.push(getClassCategoryNode(t("AppUml.EnumClass"), pkg.uuid + "enums", enums))
    }
    if (valueObjects.length > 0) {
      packageChildren.push(getClassCategoryNode(t("AppUml.ValueClass"), pkg.uuid + "valueObjects", valueObjects))
    }
    if (thirdParties.length > 0) {
      packageChildren.push(getClassCategoryNode(t("AppUml.ThirdPartyClass"), pkg.uuid + "thirdParties", thirdParties))
    }
    // if (services.length > 0) {
    //   packageChildren.push(getClassCategoryNode(t("AppUml.ServiceClass"), pkg.uuid + "services", services))
    // }

    // if (pgkCodes.length > 0) {
    //   packageChildren.push(getCodesNode(t("AppUml.CustomCode"), pkg.uuid + "codes", pgkCodes))
    // }

    for (const diagram of diagrams.filter(diagram => diagram.packageUuid === pkg.uuid)) {
      packageChildren.push({
        title: <DiagramLabel diagram={diagram} />,
        key: diagram.uuid,
        isLeaf: true,
      })
    }

    return packageChildren;
  }, [classes, getClassCategoryNode, t, diagrams])

  const getModelPackageNodes = useCallback(() => {

    return packages.map((pkg) => {
      return {
        title: <PackageLabel pkg={pkg} />,
        key: pkg.uuid,
        icon: pkg.sharable
          ? <svg style={{ width: 16, height: 16 }} viewBox="0 0 1024 1024">
            <path d="M970.666667 213.333333H546.586667a10.573333 10.573333 0 0 1-7.54-3.126666L429.793333 100.953333A52.986667 52.986667 0 0 0 392.08 85.333333H96a53.393333 53.393333 0 0 0-53.333333 53.333334v704a53.393333 53.393333 0 0 0 53.333333 53.333333h874.666667a53.393333 53.393333 0 0 0 53.333333-53.333333V266.666667a53.393333 53.393333 0 0 0-53.333333-53.333334z m10.666666 629.333334a10.666667 10.666667 0 0 1-10.666666 10.666666H96a10.666667 10.666667 0 0 1-10.666667-10.666666V138.666667a10.666667 10.666667 0 0 1 10.666667-10.666667h296.08a10.573333 10.573333 0 0 1 7.54 3.126667l109.253333 109.253333A52.986667 52.986667 0 0 0 546.586667 256H970.666667a10.666667 10.666667 0 0 1 10.666666 10.666667zM640 341.333333a85.333333 85.333333 0 0 0-81.826667 109.553334l-71.673333 43a85.333333 85.333333 0 1 0-6.566667 127.393333l38.506667 28.88a85.526667 85.526667 0 1 0 25.626667-34.106667l-38.506667-28.88a85.333333 85.333333 0 0 0 2.933333-56.726666l71.673334-43A85.333333 85.333333 0 1 0 640 341.333333zM426.666667 597.333333a42.666667 42.666667 0 1 1 42.666666-42.666666 42.713333 42.713333 0 0 1-42.666666 42.666666z m170.666666 42.666667a42.666667 42.666667 0 1 1-42.666666 42.666667 42.713333 42.713333 0 0 1 42.666666-42.666667z m42.666667-170.666667a42.666667 42.666667 0 1 1 42.666667-42.666666 42.713333 42.713333 0 0 1-42.666667 42.666666z"></path>
          </svg>
          : undefined,
        children: getPackageChildren(pkg),
      }
    })
  }, [packages, getPackageChildren]);

  const getOrchestrationNode = useCallback((orchestration: OrchestrationMeta) => {
    return {
      title: <OrchestrationLabel orchestration={orchestration} />,
      key: orchestration.uuid,
      isLeaf: true,
      icon: <FunctionOutlined />
    }
  }, [])


  const getQueryNodes = useCallback((title: string, key: string) => {
    return {
      title: title,
      key: key,
      children: orchestrations.filter(orches => orches.operateType === MethodOperateType.Query).map(orchestration => getOrchestrationNode(orchestration))
    }
  }, [getOrchestrationNode, orchestrations])

  const getMutationNodes = useCallback((title: string, key: string) => {
    return {
      title: title,
      key: key,
      children: orchestrations.filter(orches => orches.operateType === MethodOperateType.Mutation).map(orchestration => getOrchestrationNode(orchestration))
    }
  }, [getOrchestrationNode, orchestrations])

  const getOrchestrationNodes = useCallback(() => {
    const orchestrationChildren: DataNode[] = []
    const queryNodes = getQueryNodes(t("AppUml.Querys"), "querys");
    const mutationNodes = getMutationNodes(t("AppUml.Mutations"), "mutations");

    if (queryNodes?.children?.length) {
      orchestrationChildren.push(queryNodes)
    }

    if (mutationNodes?.children?.length) {
      orchestrationChildren.push(mutationNodes)
    }

    if (codes.length > 0) {
      orchestrationChildren.push(getCodesNode(t("AppUml.CustomCode"), "codes"))
    }
    return orchestrationChildren
  }, [getQueryNodes, t, getMutationNodes, codes.length, getCodesNode]);


  const treeData: DataNode[] = useMemo(() => [
    {
      icon: <SvgIcon>
        <svg style={{ width: "16px", height: "16px" }} viewBox="0 0 1024 1024" fill="currentColor">
          <path d="M907.8 226.4l0.1-0.2L526 98.2l-13.4-4.5c-0.4-0.1-0.8-0.1-1.2 0l-13.3 4.5-381.8 128 0.1 0.2c-7.7 3.2-13.4 10.7-13.4 20v509.4c0 0.7 0.4 1.4 1.1 1.7l382 162.1 13.2 5.6 12.1 5.1c0.5 0.2 1 0.2 1.4 0l12.1-5.1 13.2-5.6 382-162.1c0.7-0.3 1.1-0.9 1.1-1.7V246.3c-0.1-9.2-5.8-16.7-13.4-19.9zM483.5 862L156 723c-0.7-0.3-1.1-0.9-1.1-1.7V294.9c0-1.3 1.3-2.2 2.5-1.7l327.5 139c0.7 0.3 1.1 0.9 1.1 1.7v426.4c0 1.3-1.3 2.2-2.5 1.7z m27.8-475L201.9 255.6c-1.5-0.7-1.5-2.9 0.1-3.4l310.1-103.9 310 103.9c1.6 0.5 1.7 2.7 0.1 3.4L512.7 387c-0.4 0.2-1 0.2-1.4 0zM868 723L540.5 862c-1.2 0.5-2.5-0.4-2.5-1.7V433.9c0-0.7 0.4-1.4 1.1-1.7l327.5-139c1.2-0.5 2.5 0.4 2.5 1.7v426.4c0 0.7-0.4 1.4-1.1 1.7z"></path>
        </svg>
      </SvgIcon>,
      title:
        <TreeNodeLabel fixedAction action={<ModelRootAction />}>
          <div>{t("AppUml.DomainModel")}</div>
        </TreeNodeLabel>,
      key: "0",
      children: getModelPackageNodes()
    },
    {
      icon: <SvgIcon>
        <svg style={{ width: "16px", height: "16px" }} viewBox="0 0 1024 1024" fill="currentColor">
          <path d="M571.945277 122.592083 452.423113 122.592083c-49.502437 0-89.6406 40.139186-89.6406 89.6406 0 49.502437 40.139186 89.641623 89.6406 89.641623l119.521141 0c49.502437 0 89.641623-40.139186 89.641623-89.641623C661.585877 162.730245 621.446691 122.592083 571.945277 122.592083L571.945277 122.592083zM571.945277 242.113223 452.423113 242.113223c-16.434298 0-29.880541-13.446243-29.880541-29.880541 0-16.434298 13.446243-29.880541 29.880541-29.880541l119.521141 0c16.434298 0 29.880541 13.446243 29.880541 29.880541C601.824795 228.66698 588.379575 242.113223 571.945277 242.113223L571.945277 242.113223zM571.945277 421.395446 452.423113 421.395446c-49.502437 0-89.6406 40.139186-89.6406 89.6406 0 49.502437 40.139186 89.641623 89.6406 89.641623l119.521141 0c49.502437 0 89.641623-40.139186 89.641623-89.641623C661.585877 461.534632 621.446691 421.395446 571.945277 421.395446L571.945277 421.395446zM571.945277 540.916587 452.423113 540.916587c-16.434298 0-29.880541-13.446243-29.880541-29.880541 0-16.434298 13.446243-29.880541 29.880541-29.880541l119.521141 0c16.434298 0 29.880541 13.446243 29.880541 29.880541C601.824795 527.470343 588.379575 540.916587 571.945277 540.916587L571.945277 540.916587zM571.945277 720.198809 452.423113 720.198809c-49.502437 0-89.6406 40.139186-89.6406 89.6406s40.139186 89.6406 89.6406 89.6406l119.521141 0c49.502437 0 89.641623-40.139186 89.641623-89.6406S621.446691 720.198809 571.945277 720.198809L571.945277 720.198809zM571.945277 839.71995 452.423113 839.71995c-16.434298 0-29.880541-13.446243-29.880541-29.880541 0-16.434298 13.446243-29.880541 29.880541-29.880541l119.521141 0c16.434298 0 29.880541 13.446243 29.880541 29.880541C601.824795 826.273706 588.379575 839.71995 571.945277 839.71995L571.945277 839.71995zM243.261373 779.959891c-31.972179 0-61.951981-12.450567-84.561931-34.960233-22.509666-22.60995-34.960233-52.589752-34.960233-84.560908 0-31.972179 12.450567-61.951981 34.960233-84.561931 22.60995-22.60995 52.589752-34.960233 84.561931-34.960233l59.761082 0 0-59.761082-59.761082 0c-99.002828 0-179.282223 80.279395-179.282223 179.282223l0 0c0 99.002828 80.279395 179.282223 179.282223 179.282223l0 59.761082 89.6406-89.6406-89.6406-89.6406L243.261373 779.959891 243.261373 779.959891zM781.107017 182.352141l-59.761082 0 0 59.761082 59.761082 0c31.972179 0 61.951981 12.450567 84.560908 34.960233 22.60995 22.60995 34.960233 52.589752 34.960233 84.560908 0 31.972179-12.450567 61.951981-34.960233 84.561931-22.60995 22.509666-52.589752 34.960233-84.560908 34.960233l0-59.761082-89.6406 89.6406 89.6406 89.641623 0-59.761082c99.002828 0 179.282223-80.279395 179.282223-179.282223l0 0C960.38924 262.631536 880.110869 182.352141 781.107017 182.352141L781.107017 182.352141z"></path>
        </svg>
      </SvgIcon>,
      title:
        <TreeNodeLabel fixedAction action={<OrchestrationRootAction />}>
          <div>{t("AppUml.ServiceOrchestration")}</div>
        </TreeNodeLabel>,
      key: "1",
      children: getOrchestrationNodes()
    },

  ], [getModelPackageNodes, getOrchestrationNodes, t]);

  const handleSelect = useCallback((keys: string[]) => {
    for (const uuid of keys) {
      if (isDiagram(uuid)) {
        setSelecteDiagramId(uuid);
        if (isCode(selectedElement) || isOrches(selectedElement)) {
          setSelectedElement(undefined);
        }
      } else if (isElement(uuid)) {
        setSelectedElement(uuid);
      } else if (isCode(uuid) || isOrches(uuid)) {
        setSelectedElement(uuid);
        setSelecteDiagramId(undefined);
      } else {
        const relationUuid = parseRelationUuid(uuid);
        if (relationUuid) {
          setSelectedElement(relationUuid);
        }
      }
    }
  }, [isDiagram, isElement, isCode, isOrches, parseRelationUuid, setSelecteDiagramId, selectedElement, setSelectedElement])

  const selectedCode = useSelectedCode(appId);
  const selectedOrches = useSelectedOrcherstration(appId);
  return (
    <Container>
      <DirectoryTree
        defaultExpandedKeys={["0"]}
        selectedKeys={[selectedDiagramId || selectedCode?.uuid || selectedOrches?.uuid] as any}
        onSelect={handleSelect as any}
        treeData={treeData}
      />
    </Container>
  );
});
