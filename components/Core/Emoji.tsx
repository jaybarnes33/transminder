import { View, Text } from "react-native";
import React from "react";
import Svg, { Path, Defs, G, ClipPath, Rect } from "react-native-svg";

const Emoji = ({
  name,
  active,
  size = "lg",
}: {
  name: string;
  active?: boolean;
  size?: "sm" | "lg";
}) => {
  const icons = {
    terrible: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 32 32"
        fill="none"
      >
        <G clipPath="url(#clip0_1_9196)">
          <Path
            d="M22.667 4.454A13.334 13.334 0 112.674 16.432L2.667 16l.007-.432A13.333 13.333 0 0122.667 4.454zM16 17.6a5.999 5.999 0 00-4.285 1.8 1.334 1.334 0 101.904 1.867 3.334 3.334 0 014.763 0 1.333 1.333 0 001.904-1.867A5.999 5.999 0 0016 17.6z"
            fill="#fff"
          />
          <Path
            d="M10.667 12l2.667 1.333M21.334 12l-2.667 1.333"
            stroke="#F87171"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_1_9196">
            <Path fill="#fff" d="M0 0H32V32H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    ),

    bad: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 33 32"
        fill="none"
      >
        <G clipPath="url(#clip0_1_9204)">
          <Path
            d="M22.917 4.454A13.334 13.334 0 112.924 16.432L2.917 16l.007-.432A13.333 13.333 0 0122.917 4.454zM16.25 17.6a5.999 5.999 0 00-4.285 1.8 1.334 1.334 0 101.904 1.867 3.334 3.334 0 014.763 0 1.333 1.333 0 001.904-1.867 5.999 5.999 0 00-4.286-1.8zM12.264 12l-.17.01a1.334 1.334 0 000 2.648l.156.009.17-.01a1.333 1.333 0 000-2.648L12.264 12zm8 0l-.17.01a1.334 1.334 0 000 2.648l.156.009.17-.01a1.333 1.333 0 000-2.648L20.264 12z"
            fill="#fff"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_1_9204">
            <Path fill="#fff" transform="translate(.25)" d="M0 0H32V32H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    ),

    okay: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 33 32"
        fill="none"
      >
        <G clipPath="url(#clip0_1_9220)">
          <Path
            d="M23.167 4.454A13.334 13.334 0 113.174 16.432L3.167 16l.007-.432A13.333 13.333 0 0123.167 4.454zM20.5 18.667h-8l-.156.01a1.333 1.333 0 000 2.647l.156.01h8l.156-.01a1.334 1.334 0 000-2.648l-.156-.01zM12.514 12l-.17.01a1.334 1.334 0 000 2.648l.156.009.17-.01a1.333 1.333 0 000-2.648L12.514 12zm8 0l-.17.01a1.334 1.334 0 000 2.648l.156.009.17-.01a1.333 1.333 0 000-2.648L20.514 12z"
            fill="#fff"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_1_9220">
            <Path fill="#fff" transform="translate(.5)" d="M0 0H32V32H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    ),

    good: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 33 32"
        fill="none"
      >
        <G clipPath="url(#clip0_1_9226)">
          <Path
            d="M23.417 4.454A13.334 13.334 0 113.424 16.432L3.417 16l.007-.432A13.333 13.333 0 0123.417 4.454zm-2.4 14.594a1.333 1.333 0 00-1.885.019 3.332 3.332 0 01-4.763 0 1.333 1.333 0 00-1.904 1.866 6 6 0 008.57 0 1.333 1.333 0 00-.018-1.885zM12.764 12l-.17.01a1.334 1.334 0 00.156 2.657l.17-.01A1.333 1.333 0 0012.764 12zm8 0l-.17.01a1.334 1.334 0 00.156 2.657l.17-.01A1.333 1.333 0 0020.764 12z"
            fill="#fff"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_1_9226">
            <Path fill="#fff" transform="translate(.75)" d="M0 0H32V32H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    ),

    awesome: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 32 32"
        fill="none"
      >
        <G clipPath="url(#clip0_1_9237)">
          <Path
            d="M22.667 4.454A13.334 13.334 0 112.674 16.432L2.667 16l.007-.432A13.333 13.333 0 0122.667 4.454zm-2.4 14.594a1.333 1.333 0 00-1.885.019 3.332 3.332 0 01-4.763 0 1.333 1.333 0 00-1.904 1.866 6 6 0 008.57 0 1.333 1.333 0 00-.018-1.885z"
            fill="#fff"
          />
          <Path
            d="M13.333 13.333c-.667-1.333-3.333-1.333-4 0M22.667 13.333c-.667-1.333-3.333-1.333-4 0"
            stroke="#46C17E"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_1_9237">
            <Path fill="#fff" d="M0 0H32V32H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    ),

    happy: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 32 32"
        fill="none"
      >
        <G clipPath="url(#clip0_1_9252)">
          <Path
            d="M22.667 4.454A13.334 13.334 0 112.674 16.432L2.667 16l.007-.432A13.333 13.333 0 0122.667 4.454zM20 17.334h-8a1.334 1.334 0 00-1.333 1.333v.066a5.3 5.3 0 005.036 5.294l.303.006a5.368 5.368 0 005.32-5.053l.008-.274A1.334 1.334 0 0020 17.334zm-7.986-6.667l-.17.01A1.334 1.334 0 0012 13.333l.17-.01a1.334 1.334 0 00-.156-2.657zm8 0l-.17.01A1.334 1.334 0 0020 13.333l.17-.01a1.334 1.334 0 00-.156-2.657z"
            fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
            fillOpacity={!active && size !== "sm" ? 0.3 : 1}
          />
        </G>
        <Defs>
          <ClipPath id="clip0_1_9252">
            <Path fill="#fff" d="M0 0H32V32H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    ),

    tired: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 32 32"
        fill="none"
      >
        <G clipPath="url(#clip0_1_9258)">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.682 21.103a13.334 13.334 0 1124.637-10.205A13.334 13.334 0 013.682 21.103zm6.213-8.55a1 1 0 10-1.789.894C8.681 14.598 9.983 15 11 15c1.018 0 2.32-.403 2.895-1.553a1 1 0 00-1.789-.894c-.092.183-.457.447-1.106.447-.648 0-1.013-.264-1.105-.447zM20 19h-8l-.156.01a1.334 1.334 0 000 2.648l.156.009h8l.156-.01a1.333 1.333 0 000-2.647L20 19zm-2.113-6.894a1 1 0 011.341.447c.092.183.457.447 1.106.447s1.014-.264 1.105-.447a1 1 0 111.79.894C22.652 14.598 21.351 15 20.333 15s-2.32-.403-2.895-1.553a1 1 0 01.448-1.341z"
            fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
            fillOpacity={!active && size !== "sm" ? 0.3 : 1}
          />
        </G>
        <Defs>
          <ClipPath id="clip0_1_9258">
            <Path fill="#fff" d="M0 0H32V32H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    ),

    beamy: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 32 32"
        fill="none"
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.898 28.319A13.333 13.333 0 1021.103 3.683 13.333 13.333 0 0010.898 28.32zm3.33-15.433c-.575-1.15-1.877-1.552-2.894-1.552-1.018 0-2.32.402-2.895 1.552a1 1 0 001.79.895c.09-.184.456-.447 1.105-.447s1.014.263 1.105.447a1 1 0 101.79-.895zm9.333 0c-.575-1.15-1.876-1.552-2.894-1.552-1.018 0-2.32.402-2.895 1.552a1 1 0 001.79.895c.091-.184.456-.447 1.105-.447s1.014.263 1.105.447a1 1 0 101.79-.895zm-11.594 6.4a1 1 0 011.414.014 3.667 3.667 0 005.238 0 1 1 0 011.429 1.4 5.666 5.666 0 01-8.095 0 1 1 0 01.014-1.414z"
          fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
          fillOpacity={!active && size !== "sm" ? 0.3 : 1}
        />
      </Svg>
    ),

    anxious: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 28 28"
        fill="none"
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.898 26.319A13.333 13.333 0 1019.103 1.683 13.333 13.333 0 008.898 26.319zm1.089-15.985a1 1 0 100 2h.012a1 1 0 000-2h-.012zm8 0a1 1 0 100 2H18a1 1 0 000-2h-.013zm-8.694 6.96a1 1 0 011.262-.126l1.445.964 1.446-.964a1 1 0 011.109 0l1.445.964 1.446-.964a1 1 0 011.261.125l1.334 1.334a1 1 0 01-1.414 1.414l-.754-.754-1.318.879a1 1 0 01-1.11 0L14 19.202l-1.445.964a1 1 0 01-1.11 0l-1.317-.879-.754.754a1 1 0 01-1.414-1.414l1.333-1.334z"
          fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
          fillOpacity={!active && size !== "sm" ? 0.3 : 1}
        />
      </Svg>
    ),

    confused: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 28 28"
        fill="none"
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.898 26.319A13.333 13.333 0 1019.103 1.683 13.333 13.333 0 008.898 26.319zm1.089-15.985a1 1 0 100 2h.012a1 1 0 000-2h-.012zM18 15.667c-1.508 0-2.709.38-3.644 1.014-.93.63-1.534 1.468-1.925 2.29a1 1 0 001.806.86c.275-.579.67-1.108 1.241-1.495.565-.382 1.364-.669 2.522-.669a1 1 0 100-2zm-1.013-4.333a1 1 0 011-1H18a1 1 0 110 2h-.013a1 1 0 01-1-1z"
          fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
          fillOpacity={!active && size !== "sm" ? 0.3 : 1}
        />
      </Svg>
    ),

    satisfied: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 28 28"
        fill="none"
      >
        <Path
          d="M20.667 2.454A13.334 13.334 0 11.674 14.432L.667 14l.007-.432A13.333 13.333 0 0120.667 2.454zm-2.4 14.594a1.333 1.333 0 00-1.885.019 3.332 3.332 0 01-4.763 0 1.333 1.333 0 00-1.904 1.866 6 6 0 008.57 0 1.333 1.333 0 00-.018-1.885zM10.014 10l-.17.01A1.334 1.334 0 0010 12.666l.17-.01A1.333 1.333 0 0010.014 10zm8 0l-.17.01A1.334 1.334 0 0018 12.666l.17-.01A1.333 1.333 0 0018.014 10z"
          fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
          fillOpacity={!active && size !== "sm" ? 0.3 : 1}
        />
      </Svg>
    ),
    surprised: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 28 28"
        fill="none"
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.682 19.103A13.334 13.334 0 1126.319 8.898 13.334 13.334 0 011.682 19.103zM10 9a1 1 0 000 2h.014a1 1 0 100-2H10zm8 0a1 1 0 100 2h.015a1 1 0 100-2H18zm-8 9a4 4 0 108.001 0 4 4 0 00-8 0z"
          fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
          fillOpacity={!active && size !== "sm" ? 0.3 : 1}
        />
      </Svg>
    ),

    enthusiastic: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 28 28"
        fill="none"
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.682 19.103A13.334 13.334 0 1126.319 8.898 13.334 13.334 0 011.682 19.103zm7.692-9.81a1 1 0 10-1.414 1.414l.626.627-.626.626a1 1 0 101.414 1.414l.626-.626.627.626a1 1 0 001.414-1.414l-.627-.626.627-.627a1 1 0 00-1.414-1.414L10 9.92l-.626-.626zm2.007 8.008a1 1 0 10-1.428 1.4 5.666 5.666 0 008.095 0 1 1 0 10-1.429-1.4 3.668 3.668 0 01-5.238 0zm5.993-8.008a1 1 0 10-1.414 1.414l.626.627-.626.626a1 1 0 001.414 1.414l.626-.626.627.626a1 1 0 001.414-1.414l-.627-.626.627-.627a1 1 0 00-1.414-1.414L18 9.92l-.626-.626z"
          fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
          fillOpacity={!active && size !== "sm" ? 0.3 : 1}
        />
      </Svg>
    ),

    angry: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 28 28"
        fill="none"
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.898 26.319A13.333 13.333 0 1019.103 1.683 13.333 13.333 0 008.898 26.319zm.216-17.213a1 1 0 00-.894 1.789l2.666 1.333a1 1 0 00.895-1.789L9.114 9.106zm10.667 1.789a1 1 0 10-.895-1.79L16.22 10.44a1 1 0 00.894 1.79l2.667-1.334zm-7.976 6.547a5.667 5.667 0 016.243 1.259 1 1 0 11-1.429 1.4 3.664 3.664 0 00-4.04-.815c-.449.189-.856.466-1.198.814a1 1 0 11-1.428-1.4 5.667 5.667 0 011.852-1.258z"
          fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
          fillOpacity={!active && size !== "sm" ? 0.3 : 1}
        />
      </Svg>
    ),

    annoyed: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 28 28"
        fill="none"
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.682 19.103A13.334 13.334 0 1126.319 8.898 13.334 13.334 0 011.682 19.103zm6.546-9.217a1 1 0 10-1.789.895c.575 1.15 1.877 1.553 2.895 1.553s2.32-.403 2.894-1.553a1 1 0 00-1.789-.895c-.091.184-.457.448-1.105.448-.65 0-1.014-.264-1.106-.448zM14 17a5.667 5.667 0 00-4.047 1.7 1 1 0 101.428 1.4 3.664 3.664 0 015.238 0 1 1 0 001.429-1.4A5.668 5.668 0 0014 17zm2.22-7.56a1 1 0 011.341.446c.092.184.457.448 1.106.448s1.014-.264 1.105-.448a1 1 0 011.79.895c-.576 1.15-1.877 1.553-2.895 1.553s-2.32-.403-2.895-1.553a1 1 0 01.448-1.342z"
          fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
          fillOpacity={!active && size !== "sm" ? 0.3 : 1}
        />
      </Svg>
    ),

    sick: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 28 28"
        fill="none"
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.682 19.103A13.334 13.334 0 1126.319 8.898 13.334 13.334 0 011.682 19.103zm15.692-9.81a1 1 0 10-1.414 1.414l.626.627-.626.626a1 1 0 001.414 1.414l.626-.626.627.626a1 1 0 001.414-1.414l-.627-.626.627-.627a1 1 0 00-1.414-1.414L18 9.92l-.626-.626zm-8 0a1 1 0 10-1.414 1.414l.626.627-.626.626a1 1 0 101.414 1.414l.626-.626.627.626a1 1 0 001.414-1.414l-.627-.626.627-.627a1 1 0 00-1.414-1.414L10 9.92l-.626-.626zM14 17a5.667 5.667 0 00-4.047 1.7 1 1 0 101.428 1.4 3.666 3.666 0 015.238 0 1 1 0 101.429-1.4A5.667 5.667 0 0014 17z"
          fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
          fillOpacity={!active && size !== "sm" ? 0.3 : 1}
        />
      </Svg>
    ),

    unamused: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 28 28"
        fill="none"
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.682 19.103A13.334 13.334 0 1126.319 8.898 13.334 13.334 0 011.682 19.103zm10.546-8.217c-.575-1.15-1.877-1.552-2.894-1.552-1.018 0-2.32.403-2.895 1.552a1 1 0 001.789.895c.092-.184.457-.447 1.106-.447.648 0 1.014.263 1.105.447a1 1 0 101.79-.895zm6.123 7.384a1 1 0 00-.702-1.873l-5.333 2a1 1 0 00.702 1.873l5.333-2zm.316-8.936c1.018 0 2.32.403 2.894 1.552a1 1 0 11-1.788.895c-.092-.184-.457-.447-1.106-.447s-1.014.263-1.106.447a1 1 0 11-1.788-.895c.575-1.15 1.876-1.552 2.894-1.552z"
          fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
          fillOpacity={!active && size !== "sm" ? 0.3 : 1}
        />
      </Svg>
    ),

    empty: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 28 28"
        fill="none"
      >
        <Path
          d="M20.667 2.454A13.334 13.334 0 11.674 14.432L.667 14l.007-.432A13.333 13.333 0 0120.667 2.454zM18 16.667h-8l-.156.01a1.333 1.333 0 000 2.647l.156.01h8l.156-.01a1.334 1.334 0 000-2.648l-.156-.01zM10.014 10l-.17.01a1.334 1.334 0 000 2.648l.156.009.17-.01a1.333 1.333 0 000-2.648L10.014 10zm8 0l-.17.01a1.334 1.334 0 000 2.648l.156.009.17-.01a1.333 1.333 0 000-2.648L18.014 10z"
          fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
          fillOpacity={!active && size !== "sm" ? 0.3 : 1}
        />
      </Svg>
    ),

    "not sure": (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 28 28"
        fill="none"
      >
        <Path
          d="M20.667 2.454A13.334 13.334 0 11.674 14.432L.667 14l.007-.432A13.333 13.333 0 0120.667 2.454zM10.014 10l-.17.01a1.334 1.334 0 000 2.648l.156.009.17-.01a1.333 1.333 0 000-2.648L10.014 10zm8 0l-.17.01a1.334 1.334 0 000 2.648l.156.009.17-.01a1.333 1.333 0 000-2.648L18.014 10z"
          fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
          fillOpacity={!active && size !== "sm" ? 0.3 : 1}
        />
      </Svg>
    ),

    sad: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 28 28"
        fill="none"
      >
        <Path
          d="M20.667 2.454A13.334 13.334 0 11.674 14.432L.667 14l.007-.432A13.333 13.333 0 0120.667 2.454zM14 15.6a5.999 5.999 0 00-4.285 1.8 1.334 1.334 0 101.904 1.867 3.334 3.334 0 014.763 0 1.333 1.333 0 001.904-1.867A5.999 5.999 0 0014 15.6zM10.014 10l-.17.01a1.334 1.334 0 000 2.648l.156.009.17-.01a1.333 1.333 0 000-2.648L10.014 10zm8 0l-.17.01a1.334 1.334 0 000 2.648l.156.009.17-.01a1.333 1.333 0 000-2.648L18.014 10z"
          fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
          fillOpacity={!active && size !== "sm" ? 0.3 : 1}
        />
      </Svg>
    ),

    desperate: (
      <Svg
        width={size === "sm" ? 16 : 32}
        height={size === "sm" ? 16 : 32}
        viewBox="0 0 28 28"
        fill="none"
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.682 19.103A13.334 13.334 0 1126.319 8.898 13.334 13.334 0 011.682 19.103zM10.04 8.627a1 1 0 00-1.414 1.414l1.292 1.293-1.292 1.293a1 1 0 101.414 1.414l2-2a1 1 0 000-1.414l-2-2zM14 17a5.667 5.667 0 00-4.048 1.7 1 1 0 101.428 1.4 3.665 3.665 0 015.238 0 1 1 0 101.429-1.4A5.667 5.667 0 0014 17zm5.373-8.373a1 1 0 010 1.414l-1.293 1.293 1.293 1.293a1 1 0 01-1.414 1.414l-2-2a1 1 0 010-1.414l2-2a1 1 0 011.414 0z"
          fill={!active ? (size !== "sm" ? "#000" : "#46C17E") : "#24b2ff"}
          fillOpacity={!active && size !== "sm" ? 0.3 : 1}
        />
      </Svg>
    ),

    circle: (
      <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
        <G clipPath="url(#clip0_309_4602)">
          <Path
            d="M8.89266 3.69043C7.80074 4.14242 6.80852 4.80502 5.97266 5.64043"
            stroke="#C4C4C4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M4.02301 8.55957C3.56957 9.64987 3.33511 10.8187 3.33301 11.9996"
            stroke="#C4C4C4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M4.02344 15.4404C4.47542 16.5323 5.13803 17.5246 5.97344 18.3604"
            stroke="#C4C4C4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M8.89258 20.3096C9.98288 20.763 11.1517 20.9975 12.3326 20.9996"
            stroke="#C4C4C4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M15.7734 20.3104C16.8654 19.8584 17.8576 19.1958 18.6934 18.3604"
            stroke="#C4C4C4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M20.6426 15.44C21.096 14.3497 21.3305 13.1808 21.3326 12"
            stroke="#C4C4C4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M20.6434 8.55965C20.1914 7.46773 19.5288 6.47552 18.6934 5.63965"
            stroke="#C4C4C4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M15.773 3.69C14.6827 3.23656 13.5138 3.0021 12.333 3"
            stroke="#C4C4C4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_309_4602">
            <Rect
              width="24"
              height="24"
              fill="white"
              transform="translate(0.333008)"
            />
          </ClipPath>
        </Defs>
      </Svg>
    ),
    emoji: (
      <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
        <G clipPath="url(#clip0_309_4354)">
          <Path
            d="M17.5 3.33989C19.0083 4.21075 20.2629 5.46042 21.1398 6.96519C22.0167 8.46997 22.4854 10.1777 22.4994 11.9192C22.5135 13.6608 22.0725 15.3758 21.22 16.8946C20.3676 18.4133 19.1332 19.6831 17.6392 20.5782C16.1452 21.4733 14.4434 21.9627 12.7021 21.998C10.9608 22.0332 9.24055 21.6131 7.71155 20.7791C6.18256 19.9452 4.89787 18.7264 3.98467 17.2434C3.07146 15.7604 2.56141 14.0646 2.505 12.3239L2.5 11.9999L2.505 11.6759C2.561 9.94888 3.06355 8.26585 3.96364 6.79088C4.86373 5.31592 6.13065 4.09934 7.64089 3.25977C9.15113 2.42021 10.8531 1.98629 12.581 2.00033C14.3089 2.01437 16.0036 2.47589 17.5 3.33989ZM9.51 8.99989L9.383 9.00689C9.13995 9.0358 8.91594 9.15285 8.75341 9.33586C8.59088 9.51887 8.50111 9.75513 8.50111 9.99989C8.50111 10.2447 8.59088 10.4809 8.75341 10.6639C8.91594 10.8469 9.13995 10.964 9.383 10.9929L9.5 10.9999L9.627 10.9929C9.87005 10.964 10.0941 10.8469 10.2566 10.6639C10.4191 10.4809 10.5089 10.2447 10.5089 9.99989C10.5089 9.75513 10.4191 9.51887 10.2566 9.33586C10.0941 9.15285 9.87005 9.0358 9.627 9.00689L9.51 8.99989ZM15.51 8.99989L15.383 9.00689C15.1399 9.0358 14.9159 9.15285 14.7534 9.33586C14.5909 9.51887 14.5011 9.75513 14.5011 9.99989C14.5011 10.2447 14.5909 10.4809 14.7534 10.6639C14.9159 10.8469 15.1399 10.964 15.383 10.9929L15.5 10.9999L15.627 10.9929C15.87 10.964 16.0941 10.8469 16.2566 10.6639C16.4191 10.4809 16.5089 10.2447 16.5089 9.99989C16.5089 9.75513 16.4191 9.51887 16.2566 9.33586C16.0941 9.15285 15.87 9.0358 15.627 9.00689L15.51 8.99989Z"
            fill="black"
            fillOpacity="0.2"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_309_4354">
            <Rect
              width="24"
              height="24"
              fill="white"
              transform="translate(0.5)"
            />
          </ClipPath>
        </Defs>
      </Svg>
    ),
    "circle-dashed": (
      <Svg width="25" height="25" viewBox="0 0 25 24" fill="none">
        <G clip-path="url(#clip0_309_9769)">
          <Path
            d="M9.22664 3.69043C8.13472 4.14242 7.14251 4.80502 6.30664 5.64043"
            stroke="gray"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M4.35699 8.55957C3.90355 9.64987 3.6691 10.8187 3.66699 11.9996"
            stroke="gray"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M4.35742 15.4404C4.80941 16.5323 5.47202 17.5246 6.30742 18.3604"
            stroke="gray"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M9.22656 20.3096C10.3169 20.763 11.4857 20.9975 12.6666 20.9996"
            stroke="gray"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M16.1074 20.3104C17.1993 19.8584 18.1916 19.1958 19.0274 18.3604"
            stroke="gray"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M20.9766 15.44C21.43 14.3497 21.6645 13.1808 21.6666 12"
            stroke="gray"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M20.9773 8.55965C20.5254 7.46773 19.8627 6.47552 19.0273 5.63965"
            stroke="gray"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M16.107 3.69C15.0167 3.23656 13.8478 3.0021 12.667 3"
            stroke="gray"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_309_9769">
            <Rect
              width="24"
              height="24"
              fill="white"
              transform="translate(0.666992)"
            />
          </ClipPath>
        </Defs>
      </Svg>
    ),
  };
  return icons[name as keyof typeof icons];
};

export default Emoji;
