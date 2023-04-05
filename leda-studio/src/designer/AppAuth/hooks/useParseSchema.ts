import { useCallback } from "react";
import { ISchema } from '@formily/json-schema'
import { isArr, isObj } from '@designable/shared'
import { useParseLangMessage } from "plugin-sdk";
import { IAuthComponent } from "./model";

export function useParseSchema() {
  const p = useParseLangMessage();

  const parse = useCallback((schema: ISchema | undefined, key?: string): IAuthComponent[] => {
    const coms: any[] = [];
    if (!schema || !isObj(schema)) {
      return coms;
    }

    if (schema["x-auth"] && schema["x-auth"].enableAuth) {
      coms.push({
        name: key,
        title: p(schema["x-auth"].authTitle) || key
      })
    }

    for (const key of Object.keys(schema.properties || {})) {
      coms.push(...parse((schema.properties as any)[key], key));
    }

    if (isArr(schema.items)) {
      for (let i = 0; i < schema.items.length; i++) {
        coms.push(...parse(schema.items[i]));
      }
    } else if (schema.items) {
      const properties = (schema.items as any).properties;
      for (const key of Object.keys(properties || {})) {
        coms.push(...parse(properties[key], key));
      }
    }
    return coms
  }, [p]);

  return parse;
}