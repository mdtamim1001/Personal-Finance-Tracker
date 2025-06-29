'use client';

import { useState } from 'react';

export default function DownloadTxtButton() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/budget/summary/download-txt', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'budget-summary.txt';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      //className="btn btn-sm btn-outline"
      disabled={loading}
    >
      {loading ? 'Downloading...' : 'Download'}
    </button>
  );
}
