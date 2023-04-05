import { gql, GraphQLRequestError } from "enthooks";
import { useMemo, useEffect, useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { SYSTEM_APP_ID } from "consts";
import { useQueryOne } from "enthooks/hooks/useQueryOne";
import { useSelectedAppId } from "plugin-sdk/contexts/desinger";
import { classesState, entitiesState, packagesState } from "../recoil";
import _ from "lodash";
import { AssociationMeta } from "../model";
import { AssociationType } from "../model/IFieldSource";
import { getParentClasses } from "./getParentClasses";
import { AttributeMeta, ClassMeta, MethodMeta, RelationMeta, RelationMultiplicity, RelationType, StereoType } from "designer/AppUml/meta";
import { IApp } from "model";
import { getChildEntities } from "./getChildEntities";

export const sort = (array: { name: string }[]) => {
  return array.sort((a, b) => {
    //忽略大小写
    var nameA = a.name.toUpperCase();
    var nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    //name相等时
    return 0;
  }) as any
}

const getClassByUuid = (classUuid: string, classMetas: ClassMeta[]) => {
  return classMetas.find(cls => cls.uuid === classUuid);
}

const getEntityAssociations = (classUuid: string, classMetas: ClassMeta[], relations: RelationMeta[]) => {
  const associations: AssociationMeta[] = [];
  for (const relation of relations) {
    if (relation.relationType === RelationType.INHERIT) {
      continue;
    }

    if (!getClassByUuid(relation.targetId, classMetas) || !getClassByUuid(relation.sourceId, classMetas)) {
      continue;
    }

    if (relation.sourceId === classUuid) {
      associations.push({
        name: relation.roleOfTarget||"",
        label: relation.labelOfTarget,
        typeUuid: relation.targetId,
        associationType: relation.targetMultiplicity === RelationMultiplicity.ZERO_MANY ? AssociationType.HasMany : AssociationType.HasOne,
      })
    } else if (relation.targetId === classUuid) {
      associations.push({
        name: relation.roleOfSource||"",
        label: relation.labelOfSource,
        typeUuid: relation.sourceId,
        associationType: relation.sourceMutiplicity === RelationMultiplicity.ZERO_MANY ? AssociationType.HasMany : AssociationType.HasOne
      })
    }
  }
  return associations;
}


const makeRelations = (classes: ClassMeta[], relations: RelationMeta[]) => {
  const newRelations: RelationMeta[] = []
  for (const relation of relations) {
    if (relation.relationType === RelationType.INHERIT) {
      newRelations.push(relation);
      continue;
    }

    const sourceClass = getClassByUuid(relation.sourceId, classes)
    const targetClass = getClassByUuid(relation.targetId, classes)

    if (sourceClass?.stereoType === StereoType.Entity && targetClass?.stereoType === StereoType.Entity) {
      newRelations.push(relation);
      continue;
    }

    const sources = getChildEntities(relation.sourceId, classes, relations);
    const targets = getChildEntities(relation.targetId, classes, relations);

    if (sources.length === 0) {
      sourceClass && sources.push(sourceClass)
    }

    if (targets.length === 0) {
      targetClass && targets.push(targetClass)
    }

    for (const source of sources) {
      for (const target of targets) {
        newRelations.push({
          ...relation,
          uuid: source.uuid + target.uuid,
          sourceId: source.uuid,
          targetId: target.uuid,
          roleOfSource: source.uuid === relation.sourceId ? relation.roleOfSource : relation.roleOfSource + "Of" + source.name,
          roleOfTarget: target.uuid === relation.targetId ? relation.roleOfTarget : relation.roleOfTarget + "Of" + target.name,
          labelOfSource: source.uuid === relation.sourceId ? relation.labelOfSource : undefined,
          labelOfTarget: target.uuid === relation.targetId ? relation.labelOfTarget : undefined,
        })
      }
    }
  }
  return newRelations;
}

export function useBuildMeta(): { error?: GraphQLRequestError; loading?: boolean } {
  const appId = useSelectedAppId();
  const setEntitiesState = useSetRecoilState(entitiesState(appId));
  const setClasses = useSetRecoilState(classesState(appId));
  const setPackages = useSetRecoilState(packagesState(appId))

  const queryName = useMemo(() => "oneApp", []);
  const queryGql = useMemo(() => {
    return gql`
    query ${queryName}($appId:ID!) {
      ${queryName}(
        where:{
          id:{
            _eq:$appId
          }
        },
        orderBy:[
          {
            id:desc
          }
        ]
      ){
        id
        publishedMeta
      }
    }
  `;
  }, [queryName]);

  const metParams = useMemo(() => ({ appId }), [appId]);

  const { data, error, loading } = useQueryOne<IApp>(
    {
      gql: queryGql,
      params: metParams
    }

  );

  const systemParams = useMemo(() => ({ appId: SYSTEM_APP_ID }), []);
  const { data: systemData, error: systemError, loading: systemLoading } = useQueryOne<IApp>(
    {
      gql: appId !== SYSTEM_APP_ID ? queryGql : undefined,
      params: systemParams
    }

  );

  const makeEntity = useCallback((cls: ClassMeta, classMetas: ClassMeta[], relations: RelationMeta[]) => {
    const parentClasses = getParentClasses(cls.uuid, classMetas, relations);
    const parentAttributes: AttributeMeta[] = [];
    const parentMethods: MethodMeta[] = [];

    for (const parentCls of parentClasses) {
      parentAttributes.push(...parentCls.attributes || []);
      parentMethods.push(...parentCls.methods || []);
    }

    return {
      ...cls,
      attributes: sort(_.uniqBy([...cls.attributes || [], ...parentAttributes], "name")),
      methods: sort(_.uniqBy([...cls.methods || [], ...parentMethods], "name")),
      associations: getEntityAssociations(cls.uuid, classMetas, relations)
    }
  }, []);

  useEffect(() => {
    if (data && (systemData || appId === SYSTEM_APP_ID)) {
      const meta = data[queryName];
      const systemMeta = systemData?.[queryName];
      const getPackage = (packageUuid: string) => {
        return systemMeta?.publishedMeta?.packages?.find(pkg => pkg.uuid === packageUuid);
      }
      const systemPackages = systemMeta?.publishedMeta?.packages?.filter(pkg => pkg.sharable) || [];
      const systemClasses = systemMeta?.publishedMeta?.classes?.filter(cls => getPackage(cls.packageUuid)?.sharable) || []
      const allClasses: ClassMeta[] = [...systemClasses, ...meta?.publishedMeta?.classes || []];
      const allRelations: RelationMeta[] = makeRelations(allClasses, [...systemMeta?.publishedMeta?.relations || [], ...meta?.publishedMeta?.relations || []]);
      setPackages([...systemPackages, ...meta?.publishedMeta?.packages || []]);
      setClasses(allClasses);
      setEntitiesState(
        sort(
          allClasses.filter(
            cls => cls.stereoType === StereoType.Entity
          ).map(
            cls => makeEntity(
              cls,
              allClasses,
              allRelations
            )
          ) || []
        )
      )
    }
  }, [data, queryName, setClasses, setPackages, systemData, appId, setEntitiesState, makeEntity]);

  return { error: error || systemError, loading: loading || systemLoading };
}
