import { Input } from "antd"
import React, { memo, useCallback, useMemo } from "react"
import { IAppxAction } from "plugin-sdk/model/action"

export interface ISearchText {
  isFuzzy?: boolean,
  keyword?: string,
  fields?: string[],
  isSearchText: true,
}

export interface IComponentProps {
  searchStyle?: boolean,
  isFuzzy?: boolean,
  value?: ISearchText,
  onChange?: (value?: ISearchText) => void,
  onSearch?: IAppxAction[],
}

const Component = memo((props: IComponentProps) => {
  const { searchStyle, isFuzzy, value, onChange, onSearch, ...other } = props;
  //const doActions = useDoActions();
  //const fieldSchema = useFieldSchema();
  const fields = useMemo(() => {
    //const fieldSource = fieldSchema?.["x-field-source"];
    // return isArr(fieldSource)
    //   ? (fieldSource as IFieldSource[]).map(subField => subField.name)
    //   : ((fieldSource as IFieldSource)?.name && [(fieldSource as IFieldSource).name])
  }, [])

  const handleChange = useCallback((event?: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange({
      isFuzzy,
      keyword: event?.target.value,
      fields: fields as any,
      isSearchText: true,
    })
  }, [fields, isFuzzy, onChange]);

  // const handleSearch =  useCallback(() => {
  //   return doActions(onSearch)
  //     .then(() => {
  //     })
  //     .catch((error) => {
  //       message.error(error?.message)
  //       console.error(error)
  //     })
  // }, [doActions, onSearch])

  // const handleKeyEnter = useCallback((event: React.KeyboardEvent<HTMLElement>) => {
  //   if (event.key !== "Enter") {
  //     return;
  //   }
  //   if (!onSearch) {
  //     return;
  //   }
  //   handleSearch();
  // }, [handleSearch, onSearch])
  return (
    searchStyle
      ?
      <Input.Search value={value?.keyword} onChange={handleChange}  {...other} />
      :
      <Input value={value?.keyword} onChange={handleChange} {...other} />
  )
})

export default Component;