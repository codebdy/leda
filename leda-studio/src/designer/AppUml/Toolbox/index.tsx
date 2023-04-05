import React, { memo, useCallback } from "react";
import { Graph } from "@antv/x6";
import {
  svgInherit,
  svgOneWayAssociation,
  svgTwoWayAggregation,
  svgTwoWayAssociation,
  svgTwoWayCombination,
} from "./constSvg";
import { RelationType } from "../meta/RelationMeta";
import { pressedLineTypeState, selectedElementState } from "../recoil/atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useCreateTempClassNodeForNew } from "../hooks/useCreateTempClassNodeForNew";
import { ClassRect } from "./ClassRect";
import { StereoType } from "../meta/ClassMeta";
import { Collapse } from "antd";
import { PRIMARY_COLOR } from "consts";
import { useTranslation } from "react-i18next";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { useDnd } from "../GraphCanvas/useDnd";
import styled from "styled-components";

const { Panel } = Collapse;
const Container = styled.div`
  display: flex;
  flex-flow: column;
  border-right: solid 1px ${props=>props.theme.token?.colorBorder};
  width: 100px;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;

  //background-color: @backgrounColor;
  .ant-collapse {
    border: 0;
    //border-radius: 0;
    width: 100px;

    .ant-collapse-item {
      border-radius: 0px !important;

      .ant-collapse-header {
        border-radius: 0px !important;
      }
      .ant-collapse-content{
        border-radius: 0px !important;
      }
    }
  }
`

export const ToolItem = memo(
  (props: {
    selected?: boolean;
    children: React.ReactNode;
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
  }) => {
    const { children, onMouseDown, onClick, selected } = props;
    return (
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          alignItems: "center",
          marginBottom: "16px",
          fontSize: "13px",
          color: selected ? PRIMARY_COLOR : undefined,
          cursor: onClick ? "pointer" : "move",
        }}
        data-type="rect"
        onMouseDown={onMouseDown}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);

export const Toolbox = memo((props: { graph?: Graph }) => {
  const { graph } = props;
  const dnd = useDnd(graph)
  const { t } = useTranslation();
  const appId = useEdittingAppId();
  const setSelemedElement = useSetRecoilState(selectedElementState(appId))
  const [pressedLineType, setPressedLineType] = useRecoilState(
    pressedLineTypeState(appId)
  );
  const createTempClassNodeForNew = useCreateTempClassNodeForNew(appId);

  // useEffect(() => {
  //   const theDnd = graph
  //     ? new Dnd({
  //       target: graph,
  //       scaled: false,
  //       animation: true,
  //     })
  //     : undefined;
  //   setDnd(theDnd);
  // }, [graph]);

  const startDragFn = (stereoType: StereoType) => {
    return (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!graph) {
        return;
      }
      setSelemedElement(undefined);
      const nodeConfig = createTempClassNodeForNew(stereoType) as any;
      //nodeConfig.component = <ClassView />;
      const node = graph.createNode(nodeConfig);
      dnd?.start(node, e.nativeEvent as any);
    };
  };

  const doRelationClick = useCallback(
    (lineType: RelationType) => {
      if (lineType === pressedLineType) {
        setPressedLineType(undefined);
      } else {
        setPressedLineType(lineType);
      }
    },
    [pressedLineType, setPressedLineType]
  );

  const handleRelationClick = useCallback(
    (lineType: RelationType) => {
      return () => doRelationClick(lineType);
    },
    [doRelationClick]
  );

  return (
    <Container>
      <Collapse
        accordion
        defaultActiveKey={["1"]}
      >
        <Panel header={t("AppUml.Class")} key="1">
          <ToolItem onMouseDown={startDragFn(StereoType.Entity)}>
            <ClassRect oneBorder={false} />
            {t("AppUml.EntityClass")}
          </ToolItem>
          <ToolItem onMouseDown={startDragFn(StereoType.Abstract)}>
            <ClassRect stereoChar="A" oneBorder={false} />
            {t("AppUml.AbstractClass")}
          </ToolItem>
          <ToolItem onMouseDown={startDragFn(StereoType.Enum)}>
            <ClassRect stereoChar="E" oneBorder={true} />
            {t("AppUml.EnumClass")}
          </ToolItem>
          <ToolItem onMouseDown={startDragFn(StereoType.ValueObject)}>
            <ClassRect stereoChar="V" oneBorder={true} />
            {t("AppUml.ValueClass")}
          </ToolItem>
          {/* <ToolItem onMouseDown={startDragFn(StereoType.ThirdParty)}>
            <ClassRect stereoChar="T" oneBorder={true} />
            {t("AppUml.ThirdPartyClass")}
          </ToolItem> */}
          {/* <ToolItem onMouseDown={startDragFn(StereoType.Service)}>
            <ClassRect stereoChar="V" oneBorder={true} />
            {t("AppUml.ServiceClass")}
          </ToolItem> */}
          <ToolItem
            selected={pressedLineType === RelationType.INHERIT}
            onClick={handleRelationClick(RelationType.INHERIT)}
          >
            {svgInherit}
            {t("AppUml.Inherit")}
          </ToolItem>
        </Panel>
        <Panel header={t("AppUml.Relationships")} key="2">
          <ToolItem
            selected={pressedLineType === RelationType.TWO_WAY_ASSOCIATION}
            onClick={handleRelationClick(RelationType.TWO_WAY_ASSOCIATION)}
          >
            {svgTwoWayAssociation}
            {t("AppUml.Association")}
          </ToolItem>
          <ToolItem
            selected={pressedLineType === RelationType.TWO_WAY_AGGREGATION}
            onClick={handleRelationClick(RelationType.TWO_WAY_AGGREGATION)}
          >
            {svgTwoWayAggregation}
            {t("AppUml.Aggregation")}
          </ToolItem>
          <ToolItem
            selected={pressedLineType === RelationType.TWO_WAY_COMBINATION}
            onClick={handleRelationClick(RelationType.TWO_WAY_COMBINATION)}
          >
            {svgTwoWayCombination}
            {t("AppUml.Combination")}
          </ToolItem>
          <ToolItem
            selected={pressedLineType === RelationType.ONE_WAY_ASSOCIATION}
            onClick={handleRelationClick(RelationType.ONE_WAY_ASSOCIATION)}
          >
            {svgOneWayAssociation}
            {t("AppUml.OneWanAssociation")}
          </ToolItem>
        </Panel>
      </Collapse>
      {/* <CategoryCollapse title={intl.get("one-way-relation")}>
        <ToolItem
          selected={pressedLineType === RelationType.ONE_WAY_ASSOCIATION}
          onClick={handleRelationClick(RelationType.ONE_WAY_ASSOCIATION)}
        >
          {svgOneWayAssociation}
          {intl.get("association")}
        </ToolItem>
        <ToolItem
          selected={pressedLineType === RelationType.ONE_WAY_AGGREGATION}
          onClick={handleRelationClick(RelationType.ONE_WAY_AGGREGATION)}
        >
          {svgOneWayAggregation}
          {intl.get("aggregation")}
        </ToolItem>
        <ToolItem
          selected={pressedLineType === RelationType.ONE_WAY_COMBINATION}
          onClick={handleRelationClick(RelationType.ONE_WAY_COMBINATION)}
        >
          {svgOneWayCombination}
          {intl.get("combination")}
        </ToolItem>
      </CategoryCollapse>
      <CategoryCollapse title={intl.get("others")} disabled>
        <ToolItem
        // onMouseDown={startDragFn(StereoType.Association)}
        >
          <ClassRect stereoChar="R" oneBorder = {true} />
          {intl.get("association-class")}
        </ToolItem>
        <ToolItem
          selected={pressedLineType === RelationType.LINK_LINE}
          //onClick={handleRelationClick(RelationType.LINK_LINE)}
        >
          {svgLinkLine}
          {intl.get("link-line")}
        </ToolItem>
      </CategoryCollapse> */}
    </Container>
  );
});
