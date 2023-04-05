export enum PackageStereoType{
  Normal = 'Normal',
  ThirdParty = 'ThirdParty'
}

/**
 * 包的元数据
 */
export interface PackageMeta{
  uuid: string;
  name: string;
  system?: boolean;
  sharable?: boolean;
  stereoType?: PackageStereoType;
  tokenScript?: string;
}