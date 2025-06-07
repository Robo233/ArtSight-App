import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { EntityType } from "../types/types-common";
import Button from "../buttons/Button";
import CustomAudioPlayer from "./CustomAudioPlayer";

interface TextToSpeechSystemProps {
  id: string;
  languageCode: string;
  entityType: EntityType;
  descriptionLanguageCode: string;
}

const TextToSpeechSystem: React.FC<TextToSpeechSystemProps> = ({
  id,
  entityType,
  descriptionLanguageCode,
}) => {
  const [showControls, setShowControls] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState<boolean | null>(null);

  const audioUrl = `${
    import.meta.env.VITE_API_URL_APP
  }/media/${entityType}/${id}/audios/${descriptionLanguageCode}.mp3`;

  useEffect(() => {
    fetch(audioUrl, { method: "HEAD" })
      .then((response) => {
        setAudioAvailable(response.ok);
      })
      .catch(() => {
        setAudioAvailable(false);
      });
  }, [audioUrl]);

  if (audioAvailable !== true) {
    return null;
  }

  return (
    <div>
      {!showControls ? (
        <Button
          className="flex justify-center items-center w-8 h-8 bg-transparent"
          activeClassName="text-text-hover"
          onClick={() => setShowControls(true)}
        >
          <FontAwesomeIcon icon={faVolumeUp} className="w-7 h-7" />
        </Button>
      ) : (
        <CustomAudioPlayer
          audioUrl={audioUrl}
          onClose={() => setShowControls(false)}
        />
      )}
    </div>
  );
};

export default TextToSpeechSystem;
