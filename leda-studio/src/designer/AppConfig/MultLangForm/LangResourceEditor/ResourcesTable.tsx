import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import { useDesignerAppConfig, useDesignerParams } from 'plugin-sdk/contexts/desinger';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ILangLocalInput } from 'model';
import LangLocalEditDialog from './LangLocalEditDialog';
import { ID } from 'shared';
import { ILangLocal } from 'model';
import { useDeleteLangLocal } from 'designer/hooks/useDeleteLangLocal';
import { useShowError } from 'designer/hooks/useShowError';

const ResourcesTable = memo(() => {
  const [keyword, setKeyWord] = useState("");
  const [editingLocal, setEditingLocal] = useState<ILangLocalInput>();
  const { t } = useTranslation();
  const appConfig = useDesignerAppConfig();
  const { langLocales } = useDesignerParams();
  const [deletingId, setDeletingId] = useState<ID>();
  const getLocal = useCallback((id: ID) => {
    return langLocales?.find(lang => lang.id === id);
  }, [langLocales])

  const [remove, { error, loading }] = useDeleteLangLocal({
    onCompleted: () => {
      setDeletingId(undefined);
    }
  });

  useShowError(error);

  const columns = useMemo(() => {
    const cols: any[] = [
      {
        title: t('Name'),
        dataIndex: 'name',
        key: 'name',
      },
    ];

    appConfig?.schemaJson?.multiLang?.langs?.forEach((lang, index) => {
      if (index < 3) {
        cols.push({
          title: t("Lang." + lang.key),
          dataIndex: lang.key,
          key: lang.key,
        })
      }
    })

    cols.push({
      title: t('Operation'),
      key: 'operation',
      width: 100,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              const local = getLocal(record?.key)
              setEditingLocal({ ...local, app: { sync: { id: local?.app?.id } } })
            }}
          >
            {t("Edit")}
          </Button>
          <Button
            type="text"
            loading={record?.key === deletingId && loading}
            icon={<DeleteOutlined />}
            onClick={() => {
              setDeletingId(record?.key)
              remove(record?.key);
            }}
          >
            {
              t("Delete")
            }
          </Button>
        </Space>
      ),
    })

    return cols;
  }, [appConfig?.schemaJson?.multiLang?.langs, deletingId, getLocal, loading, remove, t]);

  const matchKeyword = useCallback((lang: ILangLocal) => {
    if (lang.name?.indexOf(keyword) > -1) {
      return true;
    }
    for (const key of Object.keys(lang.schemaJson)) {
      if (lang.schemaJson[key]?.indexOf(keyword) > -1) {
        return true;
      }
    }
    return false
  }, [keyword]);

  const data = useMemo(() => {
    return langLocales?.filter(lang => matchKeyword(lang))?.map((langLocal => {
      return {
        key: langLocal.id,
        name: langLocal.name,
        ...langLocal.schemaJson
      }
    }))
  }, [langLocales, matchKeyword])

  const handleKeywordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyWord(event.target.value);
  }, [])

  const handleClose = useCallback(() => {
    setEditingLocal(undefined);
  }, [])

  const handleNew = useCallback(() => {
    setEditingLocal({});
  }, [])

  return (
    <>
      <Table
        className="lang-resource-table"
        title={() => {
          return (
            <div className='table-toolbar'>
              <Input.Search className='search-input' allowClear onChange={handleKeywordChange} />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>{t("New")}</Button>
            </div>
          )
        }}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 'max-content', y: "calc(100vh - 300px)" }}
      />
      <LangLocalEditDialog langLocal={editingLocal} onClose={handleClose} />

    </>
  )
});

export default ResourcesTable;