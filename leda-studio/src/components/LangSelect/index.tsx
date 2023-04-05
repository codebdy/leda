import React, { memo, useCallback, useMemo } from 'react';
import { Dropdown, Button, MenuProps } from 'antd';
import { useDesignerAppConfig } from 'plugin-sdk/contexts/desinger';
import { useTranslation } from 'react-i18next';
import { TranslationOutlined } from '@ant-design/icons';

export interface IComponentProps {
}

const SelectLang = memo((props: IComponentProps) => {
  //const [selectedLang, setSelectedLang] = useState(() => getLocale());

  const appConfig = useDesignerAppConfig();
  const { t, i18n } = useTranslation();
  const handleClick = useCallback(({ key }: any): void => {
    i18n.changeLanguage(key)
  }, [i18n]);

  const items: MenuProps['items'] = useMemo(() => (appConfig?.schemaJson?.multiLang?.langs?.map((lang) => {
    return (
      {
        key: lang.key,
        label: t("Lang." + lang.key),
        icon: lang.abbr,
      }
    );
  })), [appConfig?.schemaJson?.multiLang?.langs, t])

  const isMultLang = appConfig?.schemaJson?.multiLang?.open;


  return (
    isMultLang ?
      <Dropdown
        menu={{ items, onClick: handleClick }}
        placement={'bottomLeft'}
        trigger={["click"]}
      >
        <Button
          type='text'
          shape='circle'
          icon={<TranslationOutlined />}>
        </Button>
      </Dropdown >
      :
      <></>
  );
});

export default SelectLang