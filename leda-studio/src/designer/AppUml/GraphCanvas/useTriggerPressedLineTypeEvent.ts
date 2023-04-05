import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { pressedLineTypeState } from "../recoil/atoms";
import { EVENT_PRESSED_LINE_TYPE, triggerCanvasEvent } from "./events";

// atomFamily的effects没有实验成功，暂时用该钩子代替
export function useTriggerPressedLineTypeEvent(appId: ID) {
  const pressedLineType = useRecoilValue(pressedLineTypeState(appId));

  useEffect(() => {
    triggerCanvasEvent({
      name: EVENT_PRESSED_LINE_TYPE,
      detail: pressedLineType,
    });
  }, [pressedLineType]);
}
