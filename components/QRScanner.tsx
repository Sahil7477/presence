"use client";

import { useRef, useState, useEffect } from "react";

// College coordinates (example)
const COLLEGE_LAT = 26.7692922 ; 
const COLLEGE_LNG = 88.3751071; 
const ALLOWED_RADIUS_METERS = 1000;

function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function SimpleQRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    // Step 1: Get user location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const distance = getDistanceInMeters(latitude, longitude, COLLEGE_LAT, COLLEGE_LNG);

        if (distance > ALLOWED_RADIUS_METERS) {
          alert("You must be within 100 meters of the college to scan.");
          return;
        }

        // Step 2: If within allowed range, start camera
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } },
            audio: false,
          });

          if (!videoRef.current) {
            console.error("Video element is not ready.");
            return;
          }

          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((err) => {
              console.error("Error playing video:", err);
            });
          };

          streamRef.current = stream;
          setIsScanning(true);
        } catch (error) {
          console.error("Camera error:", error);
          alert("Camera access denied or not available.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Location access is required to start scanning.");
      }
    );
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopCamera(); // cleanup on unmount
    };
  }, []);

  return (
    <div className="space-y-4 text-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full max-w-md mx-auto rounded shadow ${
          isScanning ? "block" : "hidden"
        }`}
      >
        Your browser does not support the video tag.
      </video>

      {!isScanning ? (
        <button
          onClick={startCamera}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Camera
        </button>
      ) : (
        <button
          onClick={stopCamera}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop Camera
        </button>
      )}
    </div>
  );
}
