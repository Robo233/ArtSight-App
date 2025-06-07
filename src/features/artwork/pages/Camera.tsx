import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { t } from "i18next";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavigationButton from "../../../shared/buttons/NavigationButton";
import ErrorPage from "../../../shared/components/ErrorPage";
import { HEADER_FOOTER_HEIGHT } from "../../../shared/utils/constants";
import PageTitle from "../../../shared/components/PageTitle";
import { useHistory } from "react-router-dom";
import isMobile from "../../../shared/utils/isMobile";

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isCameraStartedRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusProcessText, setStatusProcessText] = useState(
    t("camera.pleaseWait")
  );
  const history = useHistory();

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (!isCameraStartedRef.current) {
      startCamera();
      isCameraStartedRef.current = true;
    }
  }, []);

  useEffect(() => {
    let scanning = true;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const scanQRCode = () => {
      if (
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
      ) {
        const video = videoRef.current;
        const scaleFactor = 0.5;
        canvas.width = video.videoWidth * scaleFactor;
        canvas.height = video.videoHeight * scaleFactor;
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);
          if (code) {
            const match = code.data.match(/\/artwork\/([a-f0-9-]+)$/);
            if (match && match[1]) {
              const id = match[1];
              history.push(`artwork/${id}`);
            }
          }
        }
      }
      if (scanning) {
        requestAnimationFrame(scanQRCode);
      }
    };

    requestAnimationFrame(scanQRCode);
    return () => {
      scanning = false;
    };
  }, []);

  const initializeApp = async () => {
    setStatusProcessText(t("camera.scanAQR"));
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage(t("camera.cameraNotSupported"));
      console.error(
        "MediaDevices.getUserMedia is not supported on this browser."
      );
      return;
    }

    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      if (videoDevices.length === 0) {
        throw new Error("No video devices found.");
      }

      tempStream.getTracks().forEach((track) => track.stop());

      let rearCamera = videoDevices[videoDevices.length - 1];

      const constraints = {
        video: {
          deviceId: rearCamera.deviceId
            ? { exact: rearCamera.deviceId }
            : undefined,
          width: { ideal: 3840 },
          height: { ideal: 2160 },
          frameRate: { ideal: 60 },
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      mediaStreamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Error accessing the camera", err);
      if (err.name === "OverconstrainedError") {
        console.log(
          `OverconstrainedError: ${err.constraint} doesn't meet the required constraints.`
        );
      } else if (err.name === "NotAllowedError") {
        setErrorMessage(t("camera.permissionsErrorUserDeniedCameraAccess"));
        console.log("Permissions error: User denied camera access.");
      } else if (err.name === "NotFoundError") {
        setErrorMessage("No camera devices found.");
        console.log("NotFoundError: No camera devices found.");
      } else {
        console.log("Other error: ", err.message);
      }
    }
  };

  if (!isMobile()) {
    return <ErrorPage title={t("camera.cameraNotSupported")} />;
  }

  if (errorMessage) {
    return (
      <div className="flex items-center justify-center h-screen text-text text-center">
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <>
      <PageTitle title={`${t("camera.camera")}`} />
      <div
        className="bg-primary rounded-b-[2rem] rounded-t-none fixed text-white w-full z-10 flex items-center justify-end px-2 space-x-2 text-xl"
        style={{ height: `${HEADER_FOOTER_HEIGHT}px` }}
      >
        <p className="flex-1 text-[18px]">{statusProcessText}</p>
        <NavigationButton url={"/settings"} activeClassName="text-text-hover">
          <FontAwesomeIcon icon={faGear} />
        </NavigationButton>
      </div>
      <div className="top-0 left-0 w-full h-full">
        {/* The poster is a 1x1 pixel black image. It's needed in order to make the camera feed black, while the camera is loading. Otherwise a default play icon is shown */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4//8/AwAI/AL+RXkAAAAASUVORK5CYII="
          style={{ backgroundColor: "#000!important" }}
          className="w-full h-dvh object-cover"
        ></video>
      </div>
    </>
  );
};

export default Camera;
