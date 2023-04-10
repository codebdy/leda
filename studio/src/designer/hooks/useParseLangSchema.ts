import { useCallback } from "react";
import { useParseLangMessage } from "plugin-sdk/hooks/useParseLangMessage";
import { ISchema } from '@formily/json-schema'
import { isArr, isObj } from '@designable/shared'

export const LANG_RESOURCE_PREFIX = "$src:";
export const LANG_INLINE_PREFIX = "$inline:"

export function useParseLangSchema() {
  const p = useParseLangMessage();

  const parse = useCallback((schema?: ISchema) => {
    if (!schema || !isObj(schema)) {
      return schema;
    }

    schema.title = p(schema.title);

    for (const key of Object.keys(schema.properties || {})) {
      (schema.properties as any)[key] = parse((schema.properties as any)[key]);
    }

    if (isArr(schema.items)) {
      for (let i = 0; i < schema.items.length; i++) {
        (schema.properties as any)[i] = parse(schema.items[i]);
      }
    } else if (schema.items) {
      const properties = (schema.items as any).properties;
      for (const key of Object.keys(properties || {})) {
        properties[key] = parse(properties[key]);
      }
    }
    return schema
  }, [p]);

  return parse;
}