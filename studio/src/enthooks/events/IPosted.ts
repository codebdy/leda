export interface IPosted {
  entity: string,
  requested?: { [entity: string]: any };
  response?: { [entity: string]: any };
}