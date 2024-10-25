import { useState } from 'react';
import { Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BASE_URL } from '@/constant/urls';

export const DownloadReportButton = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleDownloadStatic = async () => {
    try {
      setIsDownloading(true);
      setError('');

      const response = await fetch(`${BASE_URL}/download_static_report`);

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'comprehensive_order_report.xlsx';

      link.download = fileName; // This line is crucial for preserving the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download report. Please try again.');
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <button
        onClick={handleDownloadStatic}
        disabled={isDownloading}
        className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors'
      >
        <Download className='w-4 h-4' />
        {isDownloading ? 'Downloading...' : 'Download Report'}
      </button>

      {error && (
        <Alert variant='destructive'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
