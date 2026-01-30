'use client';

import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';

import { NextImage } from '@/app/components/common';
import Btn from '@/app/ui/button/Btn';

interface ImageUploadCloudinaryProps {
  setFieldValue: (field: string, value: unknown) => void;
  values: string[];
  error?: string;
  uploadPreset?: string;
  multiple?: boolean;
}

const ImageUploadCloudinary: React.FC<ImageUploadCloudinaryProps> = ({
  setFieldValue,
  values,
  error,
  uploadPreset,
  multiple = true,
}) => {
  const [previews, setPreviews] = useState<string[]>(() =>
    Array.isArray(values) ? [...values] : values ? [values] : []
  );
  useEffect(() => {
    const newPreviews = Array.isArray(values)
      ? [...values]
      : values
        ? [values]
        : [];

    const isDifferent =
      newPreviews.length !== previews.length ||
      newPreviews.some((v, i) => v !== previews[i]);

    if (isDifferent) {
      setPreviews(newPreviews);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  // Синхронизация с Formik
  useEffect(() => {
    setFieldValue('src', multiple ? previews : (previews[0] ?? ''));
  }, [previews, setFieldValue, multiple]);

  const handleUpload = useCallback(
    (url: string) => {
      if (!url) return;

      setPreviews(prev => {
        let next: string[];
        if (multiple) {
          next = [...prev, url];
        } else {
          next = [url];
        }
        const unique = Array.from(new Set(next));
        return unique;
      });
    },
    [multiple]
  );

  const handleRemove = useCallback((url: string) => {
    setPreviews(prev => prev.filter(img => img !== url));
  }, []);

  return (
    <div>
      <CldUploadWidget
        // signatureEndpoint="/api/cloudinary/sign"
        options={{
          multiple,
          uploadPreset,
        }}
        onSuccess={result => {
          const info = result?.info as CloudinaryUploadWidgetInfo;
          if (!info?.secure_url || !info?.public_id) return;

          const url =
            typeof info === 'string'
              ? info
              : ((info as CloudinaryUploadWidgetInfo)?.secure_url ??
                (info as CloudinaryUploadWidgetInfo)?.url);

          if (url) handleUpload(url);
        }}
      >
        {({ open }) => (
          <div
            onClick={() => open?.()}
            className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-4 text-neutral-600 transition hover:opacity-80"
          >
            <AiOutlineCloudUpload size={28} />
            <span className="text-center text-sm">
              Завантажити {multiple ? 'фото' : 'лого'}
            </span>
          </div>
        )}
      </CldUploadWidget>

      {/* Превью */}
      {previews.length > 0 && (
        <div className="mt-4">
          <p className="mb-3 text-center text-sm text-gray-600">
            Прев&apos;ю завантажених зображень
          </p>
          <div className="grid justify-items-center gap-3 sm:grid-cols-2 md:grid-cols-3">
            {previews.map(img => (
              <div
                key={img}
                className="group relative h-28 w-28 rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  <NextImage
                    useSkeleton
                    width={120}
                    height={120}
                    src={img}
                    alt="uploaded"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <Btn
                  type="button"
                  title="✕"
                  uiVariant="ghost"
                  radius={999}
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(img);
                  }}
                  sx={{
                    minWidth: 24,
                    width: 24,
                    height: 24,
                    padding: 0,
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    zIndex: 20,
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    color: '#444',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,1)',
                      color: '#d32f2f',
                    },
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUploadCloudinary;
