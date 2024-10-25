'use client';

import { LogOutIcon, ListOrdered, BadgeDollarSign, Bot, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // Import Next.js hooks

export function Sidebar() {
  const router = useRouter(); // For auto-navigation
  const pathname = usePathname(); // For detecting the current path
  const [menuSelected, setMenuSelected] = useState<string>('Orders Analytics');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false); // Sidebar collapse state

  // Menu items array
  const menuItems = [
    { icon: ListOrdered, label: 'Orders Analytics', navLink: '/orders' },
    { icon: BadgeDollarSign, label: 'Sales Analytics', navLink: '/sales' },
    { icon: Bot, label: 'AI Workflow', navLink: '/ai' },
  ];

  // Automatically navigate to "Orders Analytics" on initial load
  useEffect(() => {
    if (pathname === '/') {
      router.push('/orders'); // Redirect to '/orders' when on the root path
    }
  }, [pathname, router]);

  // Update selected menu item based on the current path
  useEffect(() => {
    const selectedItem = menuItems.find((item) => item.navLink === pathname);
    if (selectedItem) {
      setMenuSelected(selectedItem.label);
    }
  }, [pathname]);

  // Toggle sidebar collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`px-5 relative h-screen flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200`}>
      {/* Sidebar Header */}
      <div className={`transition-all py-6 mb-5 duration-300 ease-in-out ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
        <h1 className='text-xl font-bold text-center'>Analytics & Report</h1>
      </div>

      {/* Sidebar Navigation */}
      <nav className='flex-1'>
        {menuItems.map((item) => (
          <Link href={item.navLink} key={item.label}>
            <Button
              variant={menuSelected === item.label ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-2 py-6 my-2 rounded-lg transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}
              onClick={() => setMenuSelected(item.label)}
            >
              <item.icon className='w-20 h-5' />
              {!isCollapsed && <span className='ml-2'>{item.label}</span>} {/* Show label only if not collapsed */}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Sidebar Footer (Logout) */}
      <div className='py-6 border-t'>
        <Button variant='ghost' className={`w-full justify-start gap-2 py-6 my-2 rounded-lg transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
          <LogOutIcon className='w-5 h-5' />
          {!isCollapsed && <span className='ml-2'>Logout</span>} {/* Show label only if not collapsed */}
        </Button>
      </div>

      {/* Toggle Collapse Button */}
      <button
        onClick={toggleCollapse}
        className='absolute right-[-12px] top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-300 transition-all duration-300'
      >
        {isCollapsed ? <ChevronRight className='w-4 h-4' /> : <ChevronLeft className='w-4 h-4' />}
      </button>
    </div>
  );
}
