import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../buttons/Button";

interface CustomAudioPlayerProps {
  audioUrl: string;
  onClose: () => void;
}

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({
  audioUrl,
  onClose,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioSliderRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const isSeekingRef = useRef(isSeeking);

  useEffect(() => {
    isSeekingRef.current = isSeeking;
  }, [isSeeking]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => {
      if (!isSeekingRef.current) {
        setCurrentTime(audio.currentTime);
        updateSliderBackground(audio.currentTime, audio.duration);
      }
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      updateSliderBackground(0, audio.duration);
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [duration]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Autoplay failed:", error);
        });
    }
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeSliderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTime = parseFloat(event.target.value);
    setSeekTime(newTime);
    updateSliderBackground(newTime, duration);
  };

  const handleSeekCommit = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
    setCurrentTime(seekTime);
    setIsSeeking(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const updateSliderBackground = (
    currentTimeValue: number,
    durationValue: number
  ) => {
    if (audioSliderRef.current && !isNaN(durationValue) && durationValue > 0) {
      const progress = (currentTimeValue / durationValue) * 100;
      audioSliderRef.current.style.background = `linear-gradient(to right, var(--color-primary) ${progress}%, #ccc ${progress}%)`;
    } else if (audioSliderRef.current) {
      audioSliderRef.current.style.background = "#ccc";
    }
  };

  return (
    <div className="custom-audio-player bg-text p-4 my-2 rounded-md shadow-md w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <Button
          className="flex justify-center items-center w-6 h-6 bg-transparent ml-auto text-background"
          activeClassName="text-text-hover"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
        </Button>
      </div>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        style={{ display: "none" }}
      />
      <div className="flex items-center justify-around mb-2">
        <Button
          onClick={togglePlayPause}
          className="p-2 text-background"
          activeClassName="text-text-hover"
        >
          <FontAwesomeIcon
            icon={isPlaying ? faPause : faPlay}
            className="w-5 h-5"
          />
        </Button>
        <div className="flex-1 mx-2 ">
          <input
            type="range"
            ref={audioSliderRef}
            min="0"
            max={duration}
            value={isSeeking ? seekTime : currentTime}
            step="0.1"
            onChange={handleTimeSliderChange}
            onMouseDown={() => setIsSeeking(true)}
            onMouseUp={handleSeekCommit}
            onTouchStart={() => setIsSeeking(true)}
            onTouchEnd={handleSeekCommit}
            className="w-full block mx-auto h-1 rounded-lg appearance-none cursor-pointer bg-[#ccc]
    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-primary-hover)] [&::-webkit-slider-thumb]:cursor-pointer
    [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-primary-hover)] [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-background">{formatTime(currentTime)}</span>
            <span className="text-background">{formatTime(duration)}</span>
          </div>
        </div>
        <Button
          onClick={toggleMute}
          className="p-2 text-background"
          activeClassName="text-text-hover"
        >
          <FontAwesomeIcon
            icon={isMuted ? faVolumeMute : faVolumeUp}
            className="w-5 h-5"
          />
        </Button>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
