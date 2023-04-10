import { Table } from 'antd';
import React, { memo, useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useParseLangMessage } from 'plugin-sdk';
import { packagesState } from '../../AppUml/recoil/atoms';
import { useEdittingAppId } from 'designer/hooks/useEdittingAppUuid';
import { useColumns } from './useColumns';
import { IAuthRow, RowType } from './IAuthRow';
import { useGetPackageCanAuthClasses } from '../hooks/useGetPackageCanAuthClasses';
import { IClassAuthConfig, IPropertyAuthConfig } from 'model';
import { ID } from 'shared';
import { useGetClassAttributes } from '../hooks/useGetClassAttributes';
import { AttributeMeta } from 'designer/AppUml/meta';

export const ModelTable = memo((
  props: {
    classConfigs: IClassAuthConfig[],
    propertyConfigs: IPropertyAuthConfig[],
    roleId: ID,
  }
) => {
  const { classConfigs, propertyConfigs, roleId } = props;
  const p = useParseLangMessage();
  const columns = useColumns(roleId);
  const appId = useEdittingAppId();
  const packages = useRecoilValue(packagesState(appId));
  const getClasses = useGetPackageCanAuthClasses(appId)
  const getClassAttributes = useGetClassAttributes(appId);

  const getClassConfig = useCallback((classUuid: string) => {
    return classConfigs.find(config => config.classUuid === classUuid && config.roleId === roleId);
  }, [classConfigs, roleId])

  const getPropertyConfig = useCallback((propertyUuid: string) => {
    return propertyConfigs.find(config => config.propertyUuid === propertyUuid && config.roleId === roleId);
  }, [propertyConfigs, roleId])

  const data: IAuthRow[] = useMemo(() => {
    return packages.map(pkg => {
      return {
        key: pkg.uuid,
        name: p(pkg.name),
        rowType: RowType.Package,
        children: getClasses(pkg.uuid).map(cls => {
          const classConfig = getClassConfig(cls.uuid);
          return {
            key: cls.uuid,
            classUuid: cls.uuid,
            name: p(cls.label || cls.name),
            rowType: RowType.Class,
            classConfig: classConfig,
            children: classConfig?.expanded
              ? getClassAttributes(cls).map((attr:AttributeMeta) => {
                return {
                  key: attr.uuid,
                  classUuid: cls.uuid,
                  propertyUuid: attr.uuid,
                  name: p(attr.label || attr.name),
                  rowType: RowType.Property,
                  propertyConfig: getPropertyConfig(attr.uuid),
                }
              })
              : undefined,
          }
        }),
      }
    }) || []
  }, [packages, p, getClasses, getClassConfig, getClassAttributes, getPropertyConfig])

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
});
