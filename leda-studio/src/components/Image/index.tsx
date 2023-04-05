import React, { CSSProperties, memo } from "react"
import styled from "styled-components";

export interface IImageProps {
  empertyIconSize?: number,
  value?: string,
  style?: CSSProperties,
  onClick?: (e: React.MouseEvent) => void,
}

const ImageContainer = styled.div`
  width: 100%;
  padding-bottom: 61.8%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  font-size: 16px;
  position: relative;
  overflow: hidden;
  .no-image-mask{
    position:absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.token?.colorBorderSecondary};
    color: ${props => props.theme.token?.colorBorder};
  }
`

export const Image = memo((props: IImageProps) => {
  const { empertyIconSize = 120, value, style, ...other } = props;
  return (
    <ImageContainer style={{ ...style, backgroundImage: `url(${value})` }} {...other}>
      {
        !value &&
        <div className="no-image-mask">
          <svg style={{ width: empertyIconSize, height: empertyIconSize }} viewBox="0 0 140 140">
            <g transform="translate(0.000000,191.000000) scale(0.100000,-0.100000)"
              fill="currentColor"
            >
              <path d="M826,1545c-38-12-85-56-102-97c-21-49-18-139,7-190c29-60,72-88,134-88c99,0,160,81,153,204c-3,56-9,75-31,105
		C940,1540,885,1563,826,1545z M960,1475c0-5-4-10-10-10c-5,0-10,5-10,10c0,6,5,10,10,10C956,1485,960,1481,960,1475z"/>
              <path d="M408,1449c-84-45-74-199,15-242c22-10,35-11,62-2c92,30,112,169,34,235C485,1468,448,1471,408,1449z M524,1394
		c-3-5-10-7-15-3c-5,3-7,10-3,15c3,5,10,7,15,3C526,1406,528,1399,524,1394z"/>
              <path d="M100,1376c-16-31,13-152,59-246c95-193,281-312,501-322c178-9,322,47,446,171c113,114,151,203,95,221c-29,9-44-2-76-56
		c-90-152-259-249-434-249c-247,1-448,167-499,412c-17,82-18,83-49,86C119,1395,109,1391,100,1376z"/>
              <path d="M1141,1281c-17-20,2-29,33-15c31,15,77-2,105-37c19-24,41-32,41-14c0,5-16,25-35,45c-31,30-42,35-84,35
		C1171,1295,1148,1289,1141,1281z"/>
            </g>
          </svg>
        </div>
      }

    </ImageContainer>
  )
})