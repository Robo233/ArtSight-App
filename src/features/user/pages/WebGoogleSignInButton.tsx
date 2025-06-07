import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleSignInButton from "./GoogleSignInButton";

type WebGoogleSignInButtonProps = {
  onSuccess: (credentialResponse: any) => void;
  onError: () => void;
};

const WebGoogleSignInButton: React.FC<WebGoogleSignInButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const login = useGoogleLogin({
    onSuccess,
    onError,
  });
  return <GoogleSignInButton onClick={() => login()} />;
};

export default WebGoogleSignInButton;
