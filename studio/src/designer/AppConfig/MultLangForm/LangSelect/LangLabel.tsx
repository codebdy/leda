import React, { CSSProperties, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ILang } from "model";

const LangLabel = React.forwardRef((
  props: {
    lang: ILang,
    fixed?: boolean,
    style?: CSSProperties,
    float?: boolean,
  },
  ref: any
) => {

  const { lang, fixed, float, style, ...other } = props;
  const [hover, setHover] = useState(false);
  const { t } = useTranslation();

  const handleMouseEnter = useCallback(() => {
    setHover(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setHover(false);
  }, []);

  return (
    <div ref={ref} className="lang-item"
      {...other}
      style={{
        ...style,
        boxShadow: float || (hover && !fixed) ? "2px 2px 10px 1px rgb(25 42 70 / 11%)" : undefined,
        pointerEvents: float ? "none" : undefined,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="lang-abbr">
        {lang.abbr.toUpperCase()}
      </div>
      <div>
        {t("Lang." + lang.key)}
      </div>
    </div>
  )
})

export default LangLabel;