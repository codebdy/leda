export type UpdateData<T> = { [entityName: string]: { data: T[] } };

export interface IUpdated{
  entity: string,
  requested: UpdateData<any>;
  response: { [entity: string]: any };
}