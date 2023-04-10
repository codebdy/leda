import { FormOutlined } from "@ant-design/icons";
import { Input, message, Modal, Tag } from "antd";
import { useDesignerAppConfig } from "plugin-sdk/contexts/desinger";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { memo } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { useShowError } from "designer/hooks/useShowError";
import { useUpsertAppConfig } from "designer/hooks/useUpsertAppConfig";
import { ILang } from "model";
import LangLabel from "./LangLabel";
import { langs } from "./langs";

const ALL_LANGS_ID = "ALL_LANGS_ID";
const SELECTED_LANGS_ID = "SELECTED_LANGS_ID";
const SELECTED_PREFIX = "SELECTED-"

const LangSelect = memo(() => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState<ILang[]>([]);
  const [changed, setChanged] = useState(false);
  const [keyword, setKeyWord] = useState("");
  const { t } = useTranslation();
  const appConfig = useDesignerAppConfig();
  const getLang = useCallback((key: any) => {
    return langs.find(lang => lang.key === key)
  }, [])

  const [upsert, { loading, error }] = useUpsertAppConfig(
    {
      onCompleted: () => {
        message.success(t("OperateSuccess"));
        reset();
        setIsModalVisible(false);
      }
    }
  );

  useShowError(error);

  const reset = useCallback(() => {
    setInputValue(appConfig?.schemaJson?.multiLang?.langs || []);
  }, [appConfig?.schemaJson?.multiLang?.langs])

  useEffect(() => {
    reset();
  }, [reset])

  const showModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleOk = useCallback(() => {
    upsert({
      ...appConfig,
      app: {
        sync: {
          id: appConfig?.app?.id,
        }
      },
      schemaJson: {
        ...appConfig?.schemaJson,
        multiLang: { ...appConfig?.schemaJson?.multiLang, langs: inputValue },
      }
    })
  }, [appConfig, inputValue, upsert]);

  const handleCancel = useCallback(() => {
    reset();
    setIsModalVisible(false);
  }, [reset]);

  const handleKeywordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyWord(event.target.value);
  }, [])

  const allLangs = useMemo(() => {
    const notSelectedLangs = langs.filter(lang => !inputValue.find(lg => lg.key === lang.key));
    if (!keyword) {
      return notSelectedLangs;
    }

    return notSelectedLangs.filter((lang) => {
      const keywd = keyword.toLocaleLowerCase();
      return lang.key.toLocaleLowerCase().indexOf(keywd) > -1 ||
        t("Lang." + lang.key).toLocaleLowerCase().indexOf(keywd) > -1
    })
  }, [inputValue, keyword, t])

  const insertAt = useCallback((lang: ILang, index: number) => {
    setChanged(true);
    setInputValue(inputValue => {
      const temp = [...inputValue]
      temp.splice(index, 0, lang)
      return temp
    })
  }, [])

  const moveTo = useCallback((lang: ILang, index: number) => {
    setChanged(true);
    setInputValue(inputValue => {
      const temp = inputValue.filter(lg => lg.key !== lang.key);
      temp.splice(index, 0, lang)
      return temp
    })
  }, [])

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      if (source?.droppableId === ALL_LANGS_ID && destination?.droppableId === SELECTED_LANGS_ID) {
        const lang = getLang(draggableId)
        if (lang && !inputValue.find(lang => lang.key === draggableId)) {
          insertAt(lang, destination.index)
        }
      } else if (source?.droppableId === SELECTED_LANGS_ID && destination?.droppableId === ALL_LANGS_ID) {
        setChanged(true);
        setInputValue((inputValue) => inputValue.filter(lang => lang.key !== draggableId.substring(SELECTED_PREFIX.length)))
      } else if (source?.droppableId === SELECTED_LANGS_ID && destination?.droppableId === SELECTED_LANGS_ID) {
        const lang = getLang(draggableId.substring(SELECTED_PREFIX.length))
        if (lang) {
          moveTo(lang, destination?.index)
        }
      }
    },
    [getLang, inputValue, insertAt, moveTo])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div onClick={showModal}>
        <div className="hover-border lang-input-box">
          {
            appConfig?.schemaJson?.multiLang?.langs?.map(lang => {
              return (
                <Tag style={{ marginBottom: 4 }}>
                  <span style={{ marginRight: 8 }}>{lang.abbr.toUpperCase()}</span>
                  {t("Lang." + lang.key)}
                </Tag>
              )
            })
          }
          <FormOutlined style={{ marginLeft: 8 }} />
        </div>
      </div>
      <Modal
        title={t("MultiLang.LangsEdit")}
        className="lang-select-dialog"
        width={700}
        visible={isModalVisible}
        okText={t("Confirm")}
        cancelText={t("Cancel")}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: !changed,
          loading: loading
        }}
      >
        <div style={{
          display: "flex",
        }}>
          <div style={{ marginRight: 8 }}>
            <div style={{
              width: 280,
              paddingBottom: 8,
              background: "#fff",
            }}>
              <Input.Search allowClear style={{ flex: 1 }} onChange={handleKeywordChange} />
            </div>
            <div className="all-lang-list">
              <Droppable droppableId={ALL_LANGS_ID} isDropDisabled={false}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef}
                    className="lang-list-inner"
                    style={{
                      flex: 1,
                      height: "100%",
                      backgroundColor: snapshot.isDraggingOver
                        ? "rgba(0,0,0, 0.05)"
                        : undefined,
                    }}
                  >
                    {allLangs?.map((lang, index) => {
                      return (
                        <Draggable key={lang.key} draggableId={lang.key} index={index}>
                          {(provided, snapshot) => (
                            <>
                              <LangLabel
                                lang={lang}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                float={snapshot.isDragging}
                                ref={provided.innerRef}
                              />
                              {snapshot.isDragging && (
                                <LangLabel
                                  lang={lang}
                                  fixed
                                />
                              )}
                            </>
                          )}
                        </Draggable>
                      );
                    })}
                    <div style={{ display: "none" }}>{provided.placeholder}</div>
                  </div>
                )}
              </Droppable>
            </div>

          </div>
          <div className="lang-list" style={{ marginLeft: 8 }}>
            <Droppable droppableId={SELECTED_LANGS_ID} isDropDisabled={false}>
              {(provided, snapshot) => (
                <div ref={provided.innerRef}
                  style={{
                    flex: 1,
                    height: "100%",
                    flexFlow: "column",
                    backgroundColor: snapshot.isDraggingOver
                      ? "rgba(0,0,0, 0.05)"
                      : undefined,
                  }}
                >
                  {inputValue?.map((lang, index) => {
                    return (
                      <Draggable key={lang.key} draggableId={SELECTED_PREFIX + lang.key} index={index}>
                        {(provided, snapshot) => (
                          <>
                            <LangLabel
                              lang={lang}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              float={snapshot.isDragging}
                              ref={provided.innerRef}
                            />
                          </>
                        )}
                      </Draggable>
                    );
                  })}
                  <div style={{ display: "none" }}>{provided.placeholder}</div>
                </div>
              )}
            </Droppable>
          </div>
        </div>

      </Modal>
    </DragDropContext>
  )
})

export default LangSelect;