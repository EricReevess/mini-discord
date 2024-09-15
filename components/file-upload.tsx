'use client';

import { X } from 'lucide-react';
import Image from 'next/image';

import { UploadDropzone } from '@/lib/uploadthing';

import { OurFileRouter } from '@/app/api/uploadthing/core';
import { useState } from 'react';

export interface Props {
  value?: string;
  onChange: (url?: string) => void;
  endpoint: keyof OurFileRouter;
}
const FileUpload = ({ onChange, value, endpoint }: Props) => {
  if (value) {
    return (
      <div className='relative h-20 w-20'>
        <Image fill src={value} alt={value} className='rounded-full' />
        <button
          onClick={() => onChange('')}
          className='bg-rose-600 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm'
        >
          <X className='w-3 h-3' type='button' />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      className='ring-0'
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.error(error);
      }}
    />
  );
};

export default FileUpload;
