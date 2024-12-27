'use client';

import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

const technologies = ['FastAPI', 'Python', 'Next.js 14', 'Tailwind CSS', 'shadcn/ui', 'Type-Safe', 'AWS LightSail & RDS', 'PostgreSQL'];

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className='max-w-xl'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-2xl font-bold'>Welcome to Calson&apos;s Full-Stack AI & Data Portfolio App!</AlertDialogTitle>
          <AlertDialogDescription className='space-y-4'>
            <p className='text-lg'>This portfolio showcases my expertise in building modern, full-stack applications with a focus on AI and data analytics.</p>
            <div className='flex flex-wrap gap-2'>
              {technologies.map((tech) => (
                <Badge key={tech} variant='secondary' className='px-3 py-1 text-sm bg-[#f1bf28]'>
                  {tech}
                </Badge>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className='px-8 mt-5'>Gotcha!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WelcomePopup;
