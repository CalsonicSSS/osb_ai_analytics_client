import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/custom/Sidebar';

export const metadata: Metadata = {
  title: 'OS&B Dashboard & Report',
  description: 'Sales Order Analytics Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='overflow-hidden'>
        <div className='flex h-screen bg-gray-100'>
          <Sidebar />
          <div className='flex-1 flex flex-col  h-[calc(100vh-1px)] overflow-auto'>
            <main className='flex-1 overflow-y-auto py-6 pr-6 ps-6'>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
