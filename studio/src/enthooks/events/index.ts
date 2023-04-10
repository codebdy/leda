import { IPosted } from "./IPosted";
import { IRemoved } from "./IRemoved";
import { IUpdated } from "./IUpdated";

export const EVENT_DATA_POSTED = "appx:posted";
export const EVENT_DATA_REMOVED = "appx:removed";
export const EVENT_DATA_UPDATED = "appx:updated";

export type Handler = (event: CustomEvent) => void;

function on(eventType: string, listener: EventListener) {
  document.addEventListener(eventType, listener);
}

function off(eventType: string, listener: EventListener) {
  document.removeEventListener(eventType, listener);
}

function trigger(eventType: string, data: IPosted | IRemoved | IUpdated) {
  console.log('trigger事件', eventType, data);
  const event = new CustomEvent(eventType, { detail: data });
  document.dispatchEvent(event);
}

export { on, off, trigger };
