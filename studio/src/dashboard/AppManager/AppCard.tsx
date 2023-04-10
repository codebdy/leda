import { Button, Card, Dropdown, MenuProps, Tooltip } from "antd"
import { memo, useCallback, useMemo, useState } from "react"
import {
  EditOutlined,
  EllipsisOutlined,
  SendOutlined,
  DeleteOutlined,
  CloudUploadOutlined
} from '@ant-design/icons';
import { IApp } from "model";
import styled from "styled-components";
import { Image } from "components/Image";
import { useNavigate } from "react-router-dom";
import { DESIGN, DESIGN_BOARD } from "consts";
import { UpsertAppModel } from "./AppModal/UpsertAppModel";
import { useTranslation } from "react-i18next";
import { useRemoveApp } from "designer/hooks/useRemoveApp";
import { useShowError } from "designer/hooks/useShowError";

const { Meta } = Card;

const StyledCard = styled(Card)`
  width:100%;
  overflow: hidden;
  cursor: default;
`

const designIcon = <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M912.785408 705.068032l-191.509504-192.3584 184.54528-185.363456c27.864064-27.974656 27.864064-71.693312 0-99.674112l-109.686784-110.17216c-27.849728-27.979776-71.375872-27.979776-99.239936 0L512.350208 302.86336l-191.50848-192.364544c-27.864064-27.974656-71.38304-27.974656-99.239936 0L110.174208 222.419968c-27.849728 27.9808-27.849728 71.699456 0 99.685376l191.515648 192.3584-158.436352 159.126528c-10.43968 10.492928-26.116096 78.688256-45.2608 199.353344v1.748992c0 13.989888 5.223424 27.974656 13.928448 38.46144 8.697856 10.504192 24.368128 15.750144 38.296576 14.002176h1.7408c121.880576-19.241984 189.774848-34.980864 201.962496-47.21664l158.429184-159.131648 191.515648 192.35328c27.856896 27.979776 71.38304 27.979776 99.232768 0l111.427584-111.915008c26.116096-24.48384 26.116096-69.946368-1.7408-96.178176zM726.895616 150.703104c12.992512-13.039616 34.093056-13.039616 45.454336 0l103.894016 104.356864c12.985344 13.04576 12.985344 34.241536 0 45.656064l-51.94752 52.169728-149.341184-151.632896 51.940352-50.54976zM269.816832 416.903168l80.920576-81.283072c6.464512-6.5024 6.464512-16.254976 0-22.757376-6.478848-6.5024-16.182272-6.5024-22.668288 0l-80.914432 81.283072-40.460288-40.644608 80.920576-81.276928c6.47168-6.5024 6.47168-16.254976 0-22.751232-6.47168-6.5024-16.182272-6.5024-22.654976 0l-80.920576 81.276928-33.98144-34.142208c-12.94336-12.998656-12.94336-32.516096 0-45.514752l103.568384-104.034304c12.950528-13.00992 32.372736-13.00992 45.323264 0L476.97408 325.86752 328.06912 475.42272l-58.252288-58.519552zM148.484096 893.929472c-8.712192 0-15.676416-6.994944-15.676416-15.73888 10.446848-66.453504 24.374272-143.392768 34.82112-173.12256l153.212928 153.885696c-29.59872 10.492928-104.46336 24.48384-172.357632 34.975744z m207.976448-75.889664L206.056448 666.947584l425.059328-426.981376 150.403072 151.08096-425.058304 426.99264z m515.156992-45.32736l-100.391936 100.836352c-12.555264 12.60544-31.373312 12.60544-43.921408 0l-43.921408-44.118016 78.430208-78.7712c6.27712-6.308864 6.27712-15.762432 0-22.065152-6.27712-6.30272-15.690752-6.30272-21.960704 0l-78.430208 78.782464-48.631808-48.847872 78.437376-78.77632c6.27712-6.30272 6.27712-15.750144 0-22.052864-6.27712-6.308864-15.690752-6.308864-21.967872 0l-78.430208 78.77632-34.5088-34.664448L700.64128 556.857344l172.544 173.316096c10.980352 11.032576 10.980352 29.934592-1.567744 42.539008z" p-id="1481"></path></svg>

export const AppCard = memo((props: {
  app: IApp,
}) => {
  const { app } = props;
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const [remove, { loading, error }] = useRemoveApp();

  useShowError(error)

  const items: MenuProps['items'] = useMemo(() => [
    {
      label: t("Edit"),
      key: 'settings',
      icon: <EditOutlined />,
      onClick: () => setVisible(true)
    },
    {
      label: t("AppManager.Publish"),
      key: 'publish',
      icon: <CloudUploadOutlined />
    },
    {
      type: 'divider',
    },
    {
      label: t('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
      onClick: () => remove(app.id),
      disabled: app.id === '1',
    },
  ], [app.id, remove, t]);

  const navigate = useNavigate();

  const hanldeEdit = useCallback(() => {
    navigate(`/${DESIGN}/${app.id}/${DESIGN_BOARD}`)
  }, [app.id, navigate])

  const handleClose = useCallback(() => {
    setVisible(false);
  }, [])


  return (
    <StyledCard
      hoverable
      cover={
        <Image
          style={{ cursor: "pointer" }}
          value={app.imageUrl}
          onClick={hanldeEdit}
        />
      }
      actions={[
        <Tooltip key="design" title={t("AppManager.ToDesign")}>
          <Button
            size="small"
            type="text"
            icon={designIcon}
            onClick={hanldeEdit}
          ></Button>
        </Tooltip>,
        <Tooltip key="preview" title={t("AppManager.ToPreview")}>
          <Button
            size="small"
            type="text"
            icon={<SendOutlined />}
          ></Button>
        </Tooltip>,
        <Dropdown menu={{ items }} trigger={['click']}>
          <Button
            size="small"
            type="text"
            key="setting"
            icon={<EllipsisOutlined />}
            loading={loading}
          ></Button>
        </Dropdown>,
      ]}
    >
      <Meta
        title={app.title}
      />
      {
        visible && <UpsertAppModel app={app} visible={visible} onClose={handleClose} />
      }

    </StyledCard>
  )
})