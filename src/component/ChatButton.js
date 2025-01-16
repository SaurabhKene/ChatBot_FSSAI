import React from "react";
import styled, { keyframes } from "styled-components";
import BotIconImg from "../assest/Images/chaticon2.png";

const BotIcon = () => {
  return (
    <BotIconContainer>
      <BotLink href="#" title="FSSAI Personal Assistance">
        <SvgIcon
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 100 100"
          enableBackground="new 0 0 100 100"
          xmlSpace="preserve"
        >
          {/* Image does not rotate */}
          <image
            x="19"
            y="15"
            width="70"
            height="70"
            id="imglogo"
            href={BotIconImg}
          />

          {/* Only the path and text rotate */}
          <g className="rotate-group">
            <path
              id="textPath"
              fill="none"
              d="M89.322,50.197c0,22.09-17.91,40-40,40c-22.089,0-40-17.91-40-40 c0-22.089,17.911-40,40-40C71.412,10.197,89.322,28.108,89.322,50.197z"
            />
            <text style={{ fill: "#fc6748", fontSize: "11px" }}>
              <textPath xlinkHref="#textPath">
                <tspan x="0">Assuring Safe & Nututious Food,</tspan>
                <tspan x="145" dx="25">
                  Inspring Trust
                </tspan>
              </textPath>
            </text>
          </g>
        </SvgIcon>
      </BotLink>
    </BotIconContainer>
  );
};

export default BotIcon;

const rotate = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `;

const BotLink = styled.a`
  display: block;
`;

const BotIconContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SvgIcon = styled.svg`
  transform-origin: 50% 50%; /* Center the rotation */
  width: 120px;
  height: 120px;
  display: block;

  /* Apply rotation animation only to the group of elements */
  .rotate-group {
    animation: ${rotate} 8s linear infinite;
    transform-origin: center;
  }
`;
