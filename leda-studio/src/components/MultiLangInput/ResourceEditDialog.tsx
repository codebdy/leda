import { AutoComplete, Form, Input, Modal, Radio, RadioChangeEvent } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { memo } from "react"
import { useTranslation } from "react-i18next";
import { useDesignerAppConfig, useDesignerParams } from "plugin-sdk/contexts/desinger";
import { useUpsertLangLocal } from "designer/hooks/useUpsertLangLocal";
import { useShowError } from "designer/hooks/useShowError";
import { LANG_INLINE_PREFIX, LANG_RESOURCE_PREFIX } from "plugin-sdk/hooks/useParseLangMessage";
import { ID } from "shared";
import { ILangLocal } from "model";

export enum MultilangType {
  Inline = "Inline",
  Resource = "Resource"
}

const ResourceEditDialog = memo((
  props: {
    multiline?: boolean,
    value?: string,
    visiable?: boolean,
    inline?: boolean,
    title?: string,
    onClose: () => void,
    onChange: (value?: string) => void,
  }
) => {
  const { multiline, value, visiable, inline, title, onClose, onChange } = props;
  const [localResourceId, setLocalResourceId] = useState<ID>();
  const [searchText, setSearchText] = useState<string>();
  const [inputType, setInputType] = useState(MultilangType.Inline);
  const { t } = useTranslation()
  const appConfig = useDesignerAppConfig();
  const [form] = Form.useForm();
  const { langLocales } = useDesignerParams();

  const options = useMemo(() => {
    return langLocales?.filter(lang => {
      return lang.name?.indexOf(searchText as any) > -1
    }).map(lang => {
      return {
        label: lang.name,
        value: lang.name,
      }
    })
  }, [langLocales, searchText]);

  const getResource = useCallback((name: string) => {
    return langLocales?.find(lang => lang.name === name)
  }, [langLocales])

  useEffect(() => {
    if (value?.startsWith(LANG_RESOURCE_PREFIX)) {
      setInputType(MultilangType.Resource)
    } else {
      setInputType(MultilangType.Inline)
    }
  }, [value])

  const clearFields = useCallback(() => {
    appConfig?.schemaJson?.multiLang?.langs?.forEach(lang => {
      form.setFieldValue(lang.key, "");
    })
  }, [appConfig?.schemaJson?.multiLang?.langs, form])

  const setReourceForm = useCallback((lang: ILangLocal | undefined) => {
    clearFields();
    setLocalResourceId(lang?.id);
    form.setFieldsValue(lang?.schemaJson)
  }, [clearFields, form])

  const resetForm = useCallback(() => {
    form.resetFields();
    if (inputType === MultilangType.Inline) {
      setLocalResourceId(undefined);
      let values: any = {}
      if (value?.startsWith(LANG_INLINE_PREFIX)) {
        values = JSON.parse(value.substring(LANG_INLINE_PREFIX.length))
      }
      form.setFieldsValue({
        ...values
      })
    } else {
      if (value?.startsWith(LANG_RESOURCE_PREFIX)) {
        const lang = getResource(value.substring(LANG_RESOURCE_PREFIX.length));
        setReourceForm(lang);
        form.setFieldValue("name", lang?.name);
      }
    }

  }, [form, getResource, inputType, setReourceForm, value])

  useEffect(() => {
    resetForm();
  }, [resetForm, inputType]);

  const hasSelectedResource = useMemo(() => localResourceId && inputType === MultilangType.Resource, [inputType, localResourceId]);

  const [upsert, { loading, error }] = useUpsertLangLocal(
    {
      onCompleted: () => {
        onClose();
      }
    }
  );

  useShowError(error);

  const handleOk = () => {
    form.validateFields().then((formValues) => {
      if (inputType === MultilangType.Inline) {
        onChange(LANG_INLINE_PREFIX + JSON.stringify(formValues))
        onClose();
      } else {
        if (hasSelectedResource) {
          onChange(LANG_RESOURCE_PREFIX + langLocales?.find(lang => lang.id === localResourceId)?.name);
          onClose();
        } else {
          const { name, ...schemaJson } = formValues
          upsert(
            {
              id: localResourceId,
              name: name,
              schemaJson: schemaJson
            }
          );
          onChange(LANG_RESOURCE_PREFIX + name);
        }
      }
    })
  };

  const handleCancel = () => {
    onClose();
    resetForm();
  };

  const onChangeType = ({ target: { value } }: RadioChangeEvent) => {
    setInputType(value);
  };

  const checkLocalId = useCallback((text: string) => {
    const lang = getResource(text);
    setLocalResourceId(lang?.id);
    setReourceForm(lang);
  }, [getResource, setReourceForm]);

  const handleSearchName = (searchText: string) => {
    setSearchText(searchText);
    checkLocalId(searchText)
  };

  const handleSelectName = (data: string) => {
    checkLocalId(data);
  };

  const InputCtrl = useMemo(() => multiline ? Input.TextArea : Input, [multiline]);
  return (
    <Modal
      title={title || t("MultiLang.LangInput")}
      open={visiable}
      okText={t("Confirm")}
      width={600}
      cancelText={t("Cancel")}
      forceRender
      okButtonProps={{
        loading: loading
      }}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {
        !inline &&
        <div style={{ paddingBottom: 16 }}>
          <Radio.Group
            onChange={onChangeType}
            options={[
              { label: t("MultiLang." + MultilangType.Inline), value: MultilangType.Inline },
              { label: t("MultiLang." + MultilangType.Resource), value: MultilangType.Resource }
            ]}
            value={inputType}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
      }

      <div style={{ maxHeight: "calc(100vh - 400px)", overflow: "auto" }}>
        <Form
          name="edit-lang-local"
          form={form}
          labelCol={{ span: 6 }}
          labelWrap
          wrapperCol={{ span: 17 }}
          autoComplete="off"
        >
          {
            inputType === MultilangType.Resource &&
            <Form.Item
              label={t("Name")}
              name={"name"}
              rules={[{ required: true, message: t("Required") }]}
            >
              <AutoComplete
                options={options}
                onSelect={handleSelectName}
                onSearch={handleSearchName}
                placeholder={t("MultiLang.InputResourceName")}
              />
            </Form.Item>
          }
          {
            appConfig?.schemaJson?.multiLang?.langs?.map((lang) => {
              return (
                <Form.Item
                  label={t("Lang." + lang.key)}
                  name={lang.key}
                >
                  <InputCtrl disabled={hasSelectedResource as any} />
                </Form.Item>
              )
            })
          }
        </Form>
      </div>
    </Modal>
  )
})

export default ResourceEditDialog;