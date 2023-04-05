
import { IPostOptions, usePostOne } from '../../enthooks/hooks/usePostOne';
import { IApp, IAppInput } from '../../model';

export function useUpsertApp(options?: IPostOptions<IApp>) {
  return usePostOne<IAppInput, IApp>("App", options)
}