// app/scanner/page.tsx or pages/scanner.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import QRScanner from '@/components/QRScanner';

export default function ScannerPage() {
  return (
    <div className="space-y-6 px-4 py-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">QR Code Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <QRScanner />
        </CardContent>
      </Card>
    </div>
  );
}
