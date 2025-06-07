// Taken from https://css-loaders.com/spinner/

import React from "react";
import { LOADING_SPINNER_SIZE } from "../utils/constants";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="absolute flex items-center justify-center w-full h-full ">
      <div
        style={{ width: `${LOADING_SPINNER_SIZE}px` }}
        className="loader p-2 aspect-square rounded-full bg-text opacity-50"
      ></div>
      <style>
        {`
          .loader {
            --_m: 
            conic-gradient(#0000 10%,#000),
            linear-gradient(#000 0 0) content-box;
            -webkit-mask: var(--_m);
            mask: var(--_m);
            -webkit-mask-composite: source-out;
            mask-composite: subtract;
            animation: l3 2s infinite linear;
          }
          @keyframes l3 {to{transform: rotate(1turn)}}
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
