import { useMemo } from "react";
import { Schema as JsonSchema } from '@formily/json-schema';
import { IDataBindSource } from "../model";
import { parse, OperationTypeNode, print, Kind, visit, ObjectValueNode, ListValueNode } from "graphql";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { IFragmentParams } from "./IFragmentParams";
import { useQueryFragmentFromSchema } from "./useQueryFragmentFromSchema";
import { IQueryForm } from "../model/IQueryForm";
import { useConvertQueryFormToGqlNodes } from "./useConvertQueryFormToGqlNodes";
import { IOrderBy } from "../model/IOrderBy";

export interface IQueryParams extends IFragmentParams {
  entityName?: string,
  rootFieldName?: string,
  refreshFlag?: number,
}

export interface IQueryOptions {
  queryForm?: IQueryForm | undefined,
  orderBys?: IOrderBy[],
  current?: number,
  pageSize?: number,
  refreshFlag?: number,
}

export enum QueryType {
  Multiple = "Multiple",
  QueryOne = "QueryOne"
}
const firstOperationDefinition = (ast: any) => ast.definitions?.[0];
const firstFiledFromOperation = (operationDefinition: any) => operationDefinition?.selectionSet?.selections?.[0];


//GQL拼接部分欠缺关联跟方法的参数
export function useQueryParams(
  dataBind: IDataBindSource | undefined,
  schema: JsonSchema | undefined,
  queryType: QueryType = QueryType.QueryOne,
  options: IQueryOptions = {},
): IQueryParams {
  const { queryForm, orderBys, current, pageSize, refreshFlag } = options || {}
  const { t } = useTranslation();
  const fragmentFromSchema = useQueryFragmentFromSchema(schema);
  //const expScope = useExpressionScope()
  const convertQueryForm = useConvertQueryFormToGqlNodes();
  const params = useMemo(() => {
    const pms: IQueryParams = { refreshFlag }
    if (dataBind?.expression) {
      try {
        const ast = parse(dataBind?.expression);
        const nodesFromQueryForm = convertQueryForm(queryForm);
        if (!dataBind?.entityName) {
          throw new Error("Can not finde entityName in dataBind");
        }

        const operation = firstOperationDefinition(ast).operation;
        const firstField = firstFiledFromOperation(firstOperationDefinition(ast));

        if (operation !== OperationTypeNode.QUERY) {
          message.error("Can not find query operation");
        }
        pms.rootFieldName = firstField?.name?.value;
        pms.entityName = dataBind?.entityName;

        console.log("Gql From Schema:", fragmentFromSchema.gql)
        const shchemaFragmentAst = fragmentFromSchema.gql && parse(fragmentFromSchema.gql);
        pms.variables = dataBind?.variables;

        var compiledAST = visit(ast, {
          // @return
          //   undefined: no action
          //   false: skip visiting this node
          //   visitor.BREAK: stop visiting altogether
          //   null: delete this node
          //   any value: replace this node with the returned value
          enter(node, key, parent, path, ancestors) {
            if ((ancestors?.[path.length - 3] as any)?.kind === Kind.OPERATION_DEFINITION &&
              node.kind === Kind.FIELD) {
              const args = [];
              //如果根Field 没有where，又有查询表单内容，则添加一个where 节点
              if (nodesFromQueryForm && nodesFromQueryForm.length > 0 &&
                !node.arguments?.find(argument => argument.name?.value === "where")
              ) {
                args.push({
                  kind: Kind.ARGUMENT,
                  name: {
                    kind: Kind.NAME,
                    value: "where"
                  },
                  value: {
                    kind: Kind.OBJECT,
                    fields: []
                  }
                })
              }
              if ((orderBys?.length || fragmentFromSchema?.orderBys?.length) &&
                !node.arguments?.find(argument => argument.name?.value === "orderBy")) {
                args.push({
                  kind: Kind.ARGUMENT,
                  name: {
                    kind: Kind.NAME,
                    value: "orderBy"
                  },
                  value: {
                    kind: Kind.LIST,
                    values: [],
                  }
                })
              }
              return {
                ...node,
                arguments: [
                  ...(node.arguments as any),
                  ...args,
                ]
              }
            }
          },
          // @return
          //   undefined: no action
          //   false: no action
          //   visitor.BREAK: stop visiting altogether
          //   null: delete this node
          //   any value: replace this node with the returned value
          leave(node, key, parent, path, ancestors) {
            if ((ancestors?.[path.length - 5] as any)?.kind === Kind.OPERATION_DEFINITION &&
              node.kind === Kind.ARGUMENT &&
              node.name?.value === "where" &&
              nodesFromQueryForm.length > 0
            ) {
              const oldValue = node.value as ObjectValueNode;
              const newFields = [...oldValue.fields, ...nodesFromQueryForm]
              return {
                ...node,
                value: {
                  ...node.value,
                  fields: newFields
                }
              }
            } else if (queryType === QueryType.Multiple &&
              (ancestors?.[path.length - 6] as any)?.kind === Kind.OPERATION_DEFINITION &&
              node.kind === Kind.FIELD &&
              node.name?.value === "nodes" &&
              ((shchemaFragmentAst as any)?.definitions?.[0] as any)?.selectionSet?.selections) {
              return {
                ...node,
                selectionSet: {
                  ...node.selectionSet || {},
                  selections: [
                    ...(node.selectionSet as any).selections || [],
                    ...((shchemaFragmentAst as any)?.definitions?.[0] as any)?.selectionSet?.selections || []
                  ]
                }
              }
            } else if (queryType === QueryType.QueryOne &&
              (ancestors?.[path.length - 4] as any)?.kind === Kind.OPERATION_DEFINITION &&
              node.kind === Kind.SELECTION_SET
            ) {
              return {
                ...node,
                selections: [
                  ...node.selections || [],
                  ...((shchemaFragmentAst as any)?.definitions?.[0] as any)?.selectionSet?.selections || []
                ]
              }
            } else if ((ancestors?.[path.length - 3] as any)?.kind === Kind.OPERATION_DEFINITION &&
              node.kind === Kind.FIELD) {
              //arguments 宿主
              const args = node.arguments?.filter(arg => arg?.name?.value !== "limit" && arg?.name?.value !== "offset") || [];
              if (pageSize) {
                args.push({
                  kind: Kind.ARGUMENT,
                  name: {
                    kind: Kind.NAME,
                    value: "limit"
                  },
                  value: {
                    kind: Kind.INT,
                    value: pageSize.toString(),
                  }
                })
              }
              if (current && current > 1) {
                args.push({
                  kind: Kind.ARGUMENT,
                  name: {
                    kind: Kind.NAME,
                    value: "offset"
                  },
                  value: {
                    kind: Kind.INT,
                    value: ((current - 1) * (pageSize||0)).toString(),
                  }
                })
              }
              return {
                ...node,
                arguments: args
              }
            } else if ((ancestors?.[path.length - 5] as any)?.kind === Kind.OPERATION_DEFINITION &&
              node.kind === Kind.ARGUMENT &&
              node.name?.value === "orderBy" &&
              (orderBys?.length || fragmentFromSchema?.orderBys?.length)
            ) {

              const newOrderBys = [
                ...fragmentFromSchema.orderBys?.filter(orderBy => !orderBys?.find(od => od.field === orderBy.field)) || [],
                ...orderBys || [],
              ]

              const newValues = newOrderBys.filter(orderBy => orderBy.order).map((order) => {
                return {
                  kind: Kind.OBJECT,
                  fields: [
                    {
                      kind: Kind.OBJECT_FIELD,
                      name: {
                        kind: Kind.NAME,
                        value: order.field,
                      },
                      value: {
                        kind: Kind.ENUM,
                        value: order.order,
                      }
                    }
                  ]
                }
              })

              const filterdOldValue = (node.value as ListValueNode)?.values.filter(
                (val: any) => !newOrderBys.find(orderBy => orderBy.field === val.fields?.[0]?.name?.value)
              )

              return {
                ...node,
                value: {
                  ...node.value,
                  values: [...filterdOldValue, ...newValues],
                }
              }
            }

            if (node.kind === Kind.STRING) {
              const newValue = node.value//Schema.shallowCompile(node.value, expScope);
              if (newValue === undefined) {
                return {
                  kind: Kind.NULL
                }
              } else {
                return {
                  ...node,
                  value: newValue
                }
              }
            }
          }
        });
        const gql = print(compiledAST);
        //console.log("compiledAST", compiledAST, gql)
        pms.gql = gql;
      } catch (err: any) {
        console.error(err);
        message.error(t("Query.GraphqlExpressionError") + err?.message)
      }
    }

    return pms;
  }, [convertQueryForm, current, dataBind?.entityName, dataBind?.expression, dataBind?.variables, fragmentFromSchema, orderBys, pageSize, queryForm, queryType, refreshFlag, t]);
  //console.log("Query GQL:", params?.gql, params?.variables);
  return params
}