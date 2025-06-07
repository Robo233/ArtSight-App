import { AdvancedMarker } from "@vis.gl/react-google-maps";
import React, { useState, useEffect } from "react";

interface SensorOptions {
  frequency?: number;
}

interface Sensor {
  start(): void;
  stop(): void;
  onreading: (this: this, ev: Event) => void;
  onerror: (this: this, ev: Event) => void;
}

declare class AbsoluteOrientationSensor implements Sensor {
  constructor(options?: SensorOptions);
  quaternion: [number, number, number, number];
  start(): void;
  stop(): void;
  onreading: (this: this, ev: Event) => void;
  onerror: (this: this, ev: Event) => void;
}

function useGenericCompassHeading() {
  const [heading, setHeading] = useState<number>(0);

  useEffect(() => {
    let sensor: AbsoluteOrientationSensor | null = null;
    if ("AbsoluteOrientationSensor" in window) {
      try {
        sensor = new AbsoluteOrientationSensor({ frequency: 60 });

        sensor.onreading = () => {
          const q = sensor!.quaternion;
          if (!q) return;
          const [x, y, z, w] = q;
          let yaw = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));
          let degrees = yaw * (180 / Math.PI);
          if (degrees < 0) {
            degrees += 360;
          }
          setHeading(degrees);
        };

        sensor.onerror = (event) => {
          console.error("Sensor error:", event);
        };

        sensor.start();
      } catch (error) {
        console.error(
          "AbsoluteOrientationSensor not available or permission denied:",
          error
        );
      }
    } else {
      console.error(
        "AbsoluteOrientationSensor is not supported by this browser."
      );
    }

    return () => {
      if (sensor) {
        sensor.stop();
      }
    };
  }, []);

  return heading;
}

interface UserMarkerProps {
  id: string;
  latitude: number | undefined;
  longitude: number | undefined;
  label: string;
}

const UserMarker: React.FC<UserMarkerProps> = ({
  latitude,
  longitude,
  label,
}) => {
  const heading = useGenericCompassHeading();

  return (
    <>
      <AdvancedMarker
        position={{ lat: Number(latitude), lng: Number(longitude) }}
      >
        <div style={{ transform: `rotate(${-heading}deg)` }} title={label}>
          <svg viewBox="0 0 24 24" width="30" height="30">
            <path
              fill="var(--color-primary)"
              stroke="var(--color-primary)"
              strokeWidth="0.5"
              strokeLinejoin="round"
              d="
              M 12.856 3.808
              A 2 2 0 0 0 11.144 3.808
              L 3.856 19.192
              A 2 2 0 0 0 5 21
              L 19 21
              A 2 2 0 0 0 20.144 19.192
              L 12.856 3.808
              Z
            "
            />
          </svg>
        </div>
      </AdvancedMarker>
    </>
  );
};

export default UserMarker;
