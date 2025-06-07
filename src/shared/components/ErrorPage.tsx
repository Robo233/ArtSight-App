import React from "react";
import HeaderWithSettings from "../navigation/headers/HeaderWithSettings";

interface ErrorPageProps {
  title: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ title }) => {
  return (
    <>
      <HeaderWithSettings />
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <div className="max-w-lg p-6 shadow-lg rounded-lg">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
