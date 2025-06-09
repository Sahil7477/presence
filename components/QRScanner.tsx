'use client';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

export default function QRScanner() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: 250,
    }, /* verbose */ false);

    scanner.render(
      (decoded) => {
        alert('QR Code Scanned: ' + decoded);
      },
      (error) => console.warn(error)
    );
  }, []);

  return <div id="reader" className="mt-4" />;
}