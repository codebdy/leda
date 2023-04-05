import { IDeleteOptions, useDeleteById } from "../../enthooks/hooks/useDeleteById";
import { ILangLocal } from "../../model";
import { ID } from "shared";


export function useDeleteLangLocal(options?: IDeleteOptions<ILangLocal>): [
  (id: ID) => void,
  {
    error?: Error,
    loading?: boolean,
  }
] {
  const [doDelete, { error, loading }] = useDeleteById<ILangLocal>("LangLocal",
    {
      ...options
    }
  );

  return [doDelete, { error: error, loading: loading }]
}