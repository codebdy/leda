import { ID } from "shared";
import { IApp } from "../../model";
import { gql } from "../../enthooks";
import { useQueryOne } from "../../enthooks/hooks/useQueryOne";
import { useMemo } from "react";
import { Device } from "@rxdrag/appx-plugin-sdk";

const appsGql = gql`
query queryApp($device:DeviceEnumComparisonExp!, id:ID!){
  oneApp(where:{
    id:{
      _eq:$id
    }
  }){
    id
    title
    pages(where:{
      device:{
        _eq:$device
      }
    }){
      id
      schema
      title
    }
  }
}
`

export function useAppDevicePages(id: ID, device: Device) {
  const params = useMemo(() => ({ id, device }), [device, id]);
  return useQueryOne<IApp>(
    {
      gql: appsGql,
      params,
      depEntityNames: ["App", "Page"]
    })
}