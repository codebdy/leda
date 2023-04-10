import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParseLangMessage } from "plugin-sdk";
import { AssgnmentItem } from "../items/AssgnmentItem";
import { IElement } from "./IElement";
import { useElementName } from "./useElementName";

export function useUserTask(element: any, modeler: any): IElement {
  const { t } = useTranslation();
  const p = useParseLangMessage();
  const name = useElementName(element, modeler);
  const iElement: IElement = useMemo(() => {
    return {
      type: t("AppBpmn.User Task"),
      name: p(name),
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill-rule="evenodd" d="M10.263 7.468c-1.698 0-2.912 1.305-2.915 2.791v.001c0 .45.121.924.311 1.352.138.309.308.593.516.82-1.235.423-2.683 1.119-3.414 2.49l-.04.075v4.44h11.083v-4.44l-.04-.074c-.72-1.352-2.136-2.047-3.36-2.471.597-.608.774-1.392.774-2.192-.004-1.487-1.218-2.792-2.915-2.792zm-1.16 1.583c.08 0 .165.003.26.008.757.045 1.012.181 1.207.31.196.13.334.252.851.268.404-.016.598-.087.737-.169.056-.033.103-.067.152-.1.128.275.197.578.198.893 0 .894-.154 1.52-.975 2.034l.08.604c.171.052.348.11.527.171.025.105.054.242.073.387.02.153.029.311.016.43a.422.422 0 01-.056.19c-.417.417-1.157.66-1.908.66-.75 0-1.49-.243-1.908-.66a.422.422 0 01-.056-.19 1.949 1.949 0 01.016-.43c.02-.146.049-.284.074-.388.177-.062.352-.118.521-.17l.048-.648a.616.616 0 00-.126-.118c-.183-.138-.405-.44-.562-.793-.157-.353-.254-.757-.254-1.08 0-.387.105-.758.297-1.079l.11-.04c.143-.046.339-.09.679-.09zm-1.448 4.304l-.002.014c-.025.185-.04.387-.018.589.021.202.074.42.248.593.595.594 1.494.857 2.382.857.889 0 1.788-.263 2.382-.857.174-.174.227-.391.249-.593a2.496 2.496 0 00-.018-.59l-.002-.01c.903.396 1.776.963 2.258 1.81v3.599H13.53v-2.538h-.67v2.538H7.651v-2.538h-.67v2.538H5.39v-3.599c.483-.849 1.359-1.416 2.264-1.813zM6.495 3C2.914 3 0 5.903 0 9.475v13.383c0 3.572 2.916 6.475 6.494 6.475h19.012c3.578 0 6.494-2.903 6.494-6.475V9.475C32 5.903 29.084 3 25.506 3H6.494zm0 2h19.01C28.016 5 30 6.98 30 9.475v13.383c0 2.495-1.985 4.475-4.494 4.475H6.494C3.985 27.333 2 25.353 2 22.858V9.475C2 6.98 3.985 5 6.494 5z"></path></svg>,
      itemGroups: [
        {
          title: t("AppBpmn.Assignment"),
          key: "assignment",
          items: <AssgnmentItem element={element} modeler={modeler} />
        }
      ]
    }
  }, [t, p, name, element, modeler]);

  return iElement;
}