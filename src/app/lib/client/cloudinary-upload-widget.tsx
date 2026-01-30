'use client';

import { useEffect, useRef, useState } from 'react';

import Btn from '@/app/ui/button/Btn';
import { NextImage } from '@/components/common';

interface Props {
  onUpload: (url: string) => void;
  initialUrl?: string;
}

interface CloudinaryUploadResult {
  event: 'success';
  info: {
    secure_url: string;
  };
}

const CloudinaryUploadWidget = ({ onUpload, initialUrl }: Props) => {
  const widgetRef = useRef<{ open: () => void } | null>(null);
  const [imageUrl, setImageUrl] = useState(initialUrl || '');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const interval = setInterval(() => {
      if (window.cloudinary && !widgetRef.current) {
        widgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
            multiple: false,
            folder: 'categories',
            sources: ['local', 'url', 'camera'],
            cropping: true,
          },
          (error: unknown, result: unknown) => {
            if (
              !error &&
              result &&
              typeof result === 'object' &&
              'event' in result &&
              result.event === 'success'
            ) {
              const upload = result as CloudinaryUploadResult;
              setImageUrl(upload.info.secure_url);
              onUpload(upload.info.secure_url);
            }
          }
        );

        setReady(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onUpload]);

  return (
    <div className="flex flex-col gap-2">
      {imageUrl && (
        <NextImage
          useSkeleton
          src={imageUrl}
          alt="Preview"
          priority
          classNames={{
            wrapper: 'w-full h-full',
            image:
              'object-contain w-full h-full max-h-[60vh] p-1 sm:p-1.5 mx-auto',
          }}
          width={450}
          height={450}
        />
      )}

      <Btn
        title={
          ready
            ? imageUrl
              ? 'Змінити зображення'
              : 'Завантажити зображення'
            : 'Завантаження...'
        }
        type="button"
        disabled={!ready}
        onClick={() => widgetRef.current?.open()}
      />
    </div>
  );
};

export default CloudinaryUploadWidget;
