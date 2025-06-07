import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
        <img src={`/logo.png`} className="w-36 h-auto" draggable="false" />
      </div>
    </>
  );
};

export default LoadingScreen;
