import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Device } from "@rxdrag/appx-plugin-sdk";

export interface IDevice {
  key: string;
  name: string;
  imageUrl: string;
}

export function useDevices() {
  const { t } = useTranslation();
  const devices: IDevice[] = useMemo(() => {
    return [
      {
        key: Device.PC,
        name: t("Devices." + Device.PC),
        imageUrl: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
      },
      {
        key: Device.Mobile,
        name: t("Devices." + Device.Mobile),
        imageUrl: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
      },
      {
        key: Device.Website,
        name: t("Devices." + Device.Website),
        imageUrl: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
      },
    ];
  }, [t]);

  return devices;
}