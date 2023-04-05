import { Schema } from '@formily/json-schema';
import { useCallback, useMemo } from 'react';
import { FieldSourceType } from '../model/IFieldSource';
import { IOrderBy } from '../model/IOrderBy';
import { IFragmentParams } from './IFragmentParams';
import { mapOrderBy } from './mapOrderBy';

export interface IGqlField {
  name: string;
  fields: IGqlField[];
  gql?: string;
  orderBys?: IOrderBy[];
}

export function useQueryFragmentFromSchema(schema?: Schema): IFragmentParams {
  const getFragmentFromSchema = useCallback((schema:Schema, fields: IGqlField[], orderBys: IOrderBy[], key?: string) => {
    let currentFields = fields;
    let currentOrderBys = orderBys;
    if (schema?.["x-field-source"]?.name && key) {
      const subFields = schema?.["x-field-source"]?.sourceType === FieldSourceType.Association ? [{ name: "id", fields: [] }] : [];
      const subOrderBys:any[] = [];
      fields.push({
        name: key,
        fields: subFields,
        orderBys: subOrderBys
      })
      currentFields = subFields;
      currentOrderBys = subOrderBys;
    }
    else if (!key) {//根节点
      //选择列表控件
      if (schema?.['x-component-props']?.["labelField"]) {
        const subFields:any[] = [];
        fields.push({
          name: schema?.['x-component-props']?.["labelField"],
          fields: subFields,
        })
      }
      if (schema?.['x-component-props']?.["valueField"]) {
        const subFields:any[] = [];
        fields.push({
          name: schema?.['x-component-props']?.["valueField"],
          fields: subFields,
        })
      }
    }

    if (schema?.["x-component-props"]?.["defaultSortOrder"] && key) {
      orderBys.push(
        {
          field: key,
          order: mapOrderBy(schema?.["x-component-props"]?.["defaultSortOrder"]),
        }
      )
    }

    if (schema?.properties) {
      for (const key of Object.keys(schema?.properties)) {
        getFragmentFromSchema(schema.properties[key], currentFields, currentOrderBys, key)
      }
    }
    if ((schema?.items as any)?.properties) {
      for (const key of Object.keys((schema?.items as any)?.properties)) {
        getFragmentFromSchema((schema?.items as any).properties[key], currentFields, currentOrderBys, key)
      }
    }
  }, [])

  const makeOneField = useCallback((field: IGqlField) => {
    const subFieldGql = field.fields.map(subField => makeOneField(subField)).join("\n")
    const gql: any = field.name + (subFieldGql ? `{\n${subFieldGql}\n}` : "");
    return gql;
  }, []);

  const fragment = useMemo(() => {
    const fields: IGqlField[] = [];
    const orderBys: IOrderBy[] = []
    getFragmentFromSchema(schema as any, fields, orderBys)

    if (fields?.length > 0) {
      let variables = {}
      const fratmentParams: IFragmentParams = {
        gql: fields.length > 0 ? `{\n${fields.map(field => makeOneField(field)).join("\n ")}\n}` : "",
        variables,
        orderBys,
      }

      return fratmentParams;
    }
    return {}
  }, [getFragmentFromSchema, makeOneField, schema]);


  return fragment
}