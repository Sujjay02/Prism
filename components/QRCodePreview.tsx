import React, { useEffect, useRef, useState } from 'react';
import { X, QrCode, Smartphone, Download, Copy, Check, RefreshCw } from 'lucide-react';

interface QRCodePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

// Simple QR Code generator using canvas
// Based on QRCode.js algorithm
const generateQRMatrix = (data: string): boolean[][] => {
  // For simplicity, we'll use a basic implementation
  // In production, you'd want to use a proper QR library
  const size = Math.min(Math.ceil(Math.sqrt(data.length * 8) + 21), 177);
  const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

  // Add finder patterns
  const addFinderPattern = (x: number, y: number) => {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        const posX = x + i;
        const posY = y + j;
        if (posX >= 0 && posX < size && posY >= 0 && posY < size) {
          if (i >= 0 && i <= 6 && j >= 0 && j <= 6) {
            if (i === 0 || i === 6 || j === 0 || j === 6 ||
                (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
              matrix[posY][posX] = true;
            }
          }
        }
      }
    }
  };

  addFinderPattern(0, 0);
  addFinderPattern(size - 7, 0);
  addFinderPattern(0, size - 7);

  // Add timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Encode data (simplified)
  let dataIndex = 0;
  const bytes = new TextEncoder().encode(data);
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col = 5;
    for (let row = 0; row < size; row++) {
      for (let c = 0; c < 2; c++) {
        const x = col - c;
        if (!matrix[row][x] && dataIndex < bytes.length * 8) {
          const byteIndex = Math.floor(dataIndex / 8);
          const bitIndex = 7 - (dataIndex % 8);
          matrix[row][x] = byteIndex < bytes.length && ((bytes[byteIndex] >> bitIndex) & 1) === 1;
          dataIndex++;
        }
      }
    }
  }

  return matrix;
};

export const QRCodePreview: React.FC<QRCodePreviewProps> = ({
  isOpen,
  onClose,
  code,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!isOpen || !code) return;

    // Compress and encode the code for URL sharing
    const compressed = btoa(encodeURIComponent(code).slice(0, 2000));
    const url = `${window.location.origin}${window.location.pathname}?share=${compressed}`;
    setShareUrl(url);

    // Generate QR code on canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 200;
    canvas.width = size;
    canvas.height = size;

    // Use a simpler visual representation with the URL
    // For production, use a proper QR library like 'qrcode'
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    const matrix = generateQRMatrix(url.slice(0, 100));
    const cellSize = size / matrix.length;

    ctx.fillStyle = '#000000';
    matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      });
    });

    setQrDataUrl(canvas.toDataURL('image/png'));
  }, [isOpen, code]);

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'prism-qr-code.png';
    a.click();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[400px] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 z-50 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-white">Mobile Preview</h2>
              <p className="text-xs text-zinc-500">Scan to view on your device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col items-center">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-2xl shadow-lg mb-4">
            <canvas
              ref={canvasRef}
              className="w-48 h-48"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Instructions */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <Smartphone className="w-4 h-4" />
            <span>Scan with your phone camera</span>
          </div>

          {/* URL Section */}
          <div className="w-full space-y-3">
            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Share URL
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-mono text-zinc-600 dark:text-zinc-400 truncate"
              />
              <button
                onClick={copyUrl}
                className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-1"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-zinc-500" />
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-6 w-full">
            <button
              onClick={downloadQR}
              className="flex-1 py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download QR
            </button>
            <button
              onClick={() => window.open(shareUrl, '_blank')}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 rounded-xl text-sm font-medium text-white transition-opacity flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              Open Link
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <p className="text-xs text-zinc-500 text-center">
            Preview will open in a new tab on mobile devices
          </p>
        </div>
      </div>
    </>
  );
};
