import { Upload, UploadFile, UploadProps } from "antd";
import React, { memo, useCallback, useEffect, useState } from "react"
import { RcFile } from "antd/lib/upload";
import { isArray } from "lodash";
import { useUpload } from "enthooks/hooks/useUpload";
import { useParseLangMessage } from "plugin-sdk";
import { UploadChangeParam } from "antd/es/upload";

export interface ImageUploaderProps {
  title?: string,
  maxCount?: number,
  value?: string | string[],
  onChange?: (value?: string | string[]) => void,
}

//裁剪失效，以后再说
const ImageUploader = memo((props: ImageUploaderProps) => {
  const { title, maxCount = 1, value, onChange, ...other } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (isArray(value)) {
      setFileList(value.map(child => ({
        uid: '-1',
        status: 'done',
        name: "",
        url: child,
      })))
    } else if (value) {
      setFileList([{
        uid: '-1',
        status: 'done',
        name: "",
        url: value,
      }])
    } else {
      setFileList([])
    }
  }, [value])

  const upload = useUpload();

  const p = useParseLangMessage();

  const handleChange: UploadProps['onChange'] = useCallback(({ fileList: newFileList, file, event }: UploadChangeParam) => {
    setFileList(newFileList);
    if (maxCount === 1) {
      if (newFileList?.[0]?.status === "done") {
        onChange && onChange(newFileList?.[0]?.url || newFileList?.[0]?.xhr?.responseURL || "");
        return;
      }
      if (!newFileList?.length) {
        onChange && onChange("")
      }
    } else {
      if (!newFileList?.find(file => file.status !== "done")) {
        onChange && onChange(newFileList?.map(file => file.url || file.xhr?.responseURL) || []);
        return;
      }
      if (!newFileList?.length) {
        onChange && onChange([])
      }
    }
  }, [maxCount, onChange]);

  const handlePreview = useCallback(async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  }, []);


  return (
    <Upload
      {...other}
      action={upload}
      listType="picture-card"
      fileList={fileList}
      onChange={handleChange}
      onPreview={handlePreview}
    >
      {fileList.length < maxCount && `+ ${p(title)}`}
    </Upload>
  )
})

export default ImageUploader;