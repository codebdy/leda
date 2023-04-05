import { SyncOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useShowError } from 'designer/hooks/useShowError';
import { useEdittingAppId } from 'designer/hooks/useEdittingAppUuid';
import { usePublishMeta } from '../hooks/usePublishMeta';
import { changedState } from '../recoil/atoms';
import { usePublished } from '../hooks/usePublished';
import { EVENT_DATA_POSTED, trigger } from 'enthooks/events';

const PublishButton = memo(() => {
  const appId = useEdittingAppId();
  const changed = useRecoilValue(changedState(appId))
  const published = usePublished(appId)
  const { t } = useTranslation();

  const [publish, { loading, error }] = usePublishMeta(appId, {
    onCompleted() {
      trigger(EVENT_DATA_POSTED, { entity: "App" })
      message.success(t("OperateSuccess"));
    },
  });

  useShowError(error);

  const handlePublish = useCallback(() => {
    publish()
  }, [publish])


  return (
    <Button
      disabled={published || changed}
      type='primary'
      loading={loading}
      icon={<SyncOutlined />}
      onClick={handlePublish}
    >
      {t("Publish")}
    </Button>
  )
});

export default PublishButton;