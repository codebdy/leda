import { IDeleteOptions, useDeleteById } from "../../enthooks/hooks/useDeleteById";
import { IApp } from "../../model";

export function useRemoveApp(options?: IDeleteOptions<IApp>) {
    return useDeleteById<IApp>("App", options)
}