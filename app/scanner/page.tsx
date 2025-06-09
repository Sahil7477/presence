import QRScanner from '@/components/QRScanner';

export default function ScannerPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold">QR Code Scanner</h2>
      <div className="p-4 border rounded-xl shadow bg-white dark:bg-gray-800">
        <QRScanner />
      </div>
    </div>
  );
}