import { DeleteOutlined, EyeInvisibleOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import React, { memo, useState } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ClassMeta, StereoType } from '../../meta/ClassMeta';

const ClassActions = memo((
  props: {
    cls: ClassMeta,
    onAddAttribute: () => void,
    onAddMethod: () => void,
    onHidden: () => void,
    onDelete: () => void,
    onVisible: (visible: boolean) => void,
  }
) => {
  const { cls, onAddAttribute, onAddMethod, onHidden, onDelete, onVisible } = props;
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const handleMenuClick = useCallback((e: any) => {
    setVisible(false);
    onVisible(false);
    if (e.key === 'addAttribute') {
      onAddAttribute();
    }
    if (e.key === 'addMethod') {
      onAddMethod();
    }
    if (e.key === 'hidden') {
      onHidden();
    }
    if (e.key === 'delete') {
      onDelete();
    }
  }, [onVisible, onAddAttribute, onAddMethod, onHidden, onDelete]);

  const handleVisibleChange = useCallback((flag: any) => {
    setVisible(flag);
    onVisible(flag);
  }, [onVisible]);

  return (
    <div>
      <div
        style={{
          position: "absolute",
          right: "16px",
          top: "-4px",
        }}
      >
        <Button
          shape="circle"
          type="text"
          onClick={onHidden}
        >
          <EyeInvisibleOutlined />
        </Button>
      </div>
      <Dropdown
        trigger={["click"]}
        menu={{
          onClick: handleMenuClick,
          items: [
            {
              icon: <PlusOutlined />,
              label: t("AppUml.AddAttribute"),
              key: 'addAttribute',
              disabled: cls.stereoType === StereoType.Service,
            },
            {
              icon: <PlusOutlined />,
              label: t("AppUml.AddMethod"),
              key: 'addMethod',
              disabled: cls.stereoType === StereoType.Enum || cls.stereoType === StereoType.ValueObject,
            },
            {
              icon: <EyeInvisibleOutlined />,
              label: t("Hidden"),
              key: 'hidden',
            },
            {
              icon: <DeleteOutlined />,
              label: t("Delete"),
              key: 'delete',
            },
          ]
        }}
        onOpenChange={handleVisibleChange}
        open={visible}
      >
        <div
          style={{
            position: "absolute",
            right: "-20px",
            top: "-4px",
            paddingRight: "16px",
          }}
        >
          <Button
            shape="circle"
            type="text"
            onClick={(e) => e.preventDefault()}
          >
            <MoreOutlined />
          </Button>
        </div>

      </Dropdown>
    </div>
  );
});

export default ClassActions;