"use client";

import { useRef, useState, useEffect } from "react";

export default function SimpleQRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      streamRef.current = stream;
      setIsScanning(true);
    } catch (error) {
      console.error("Camera error:", error);
      alert("Camera access denied or not available.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4 text-center">
      {!isScanning ? (
        <button onClick={startCamera} className="bg-blue-500 text-white px-4 py-2 rounded">
          Start Camera
        </button>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-md mx-auto rounded shadow"
          />
          <button onClick={stopCamera} className="bg-red-500 text-white px-4 py-2 rounded">
            Stop Camera
          </button>
        </>
      )}
    </div>
  );
}
