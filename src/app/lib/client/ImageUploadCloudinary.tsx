'use client';

import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import React, { useCallback, useMemo } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';

import { NextImage } from '@/app/components/common';
import Btn from '@/app/components/ui/button/Btn';

interface ImageUploadCloudinaryProps {
  fieldName: string;
  setFieldValue: (field: string, value: unknown) => void;
  values: string[];
  error?: string;
  uploadPreset?: string;
  multiple?: boolean;
}

const normalizeValues = (values: string[] | string | undefined | null) =>
  Array.isArray(values) ? values : values ? [values] : [];

const unlockPageScroll = () => {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
};

const ImageUploadCloudinary: React.FC<ImageUploadCloudinaryProps> = ({
  fieldName,
  setFieldValue,
  values,
  error,
  uploadPreset,
  multiple = true,
}) => {
  const previews = useMemo(() => normalizeValues(values), [values]);

  const handleUpload = useCallback(
    (url: string) => {
      if (!url) return;

      const nextValues = multiple
        ? Array.from(new Set([...previews, url]))
        : [url];

      setFieldValue(fieldName, nextValues);
      unlockPageScroll();
    },
    [fieldName, multiple, previews, setFieldValue]
  );

  const handleRemove = useCallback(
    (url: string) => {
      const nextValues = previews.filter(img => img !== url);
      setFieldValue(fieldName, nextValues);
    },
    [fieldName, previews, setFieldValue]
  );

  return (
    <div>
      <CldUploadWidget
        options={{
          multiple,
          uploadPreset,
        }}
        onSuccess={result => {
          const info = result?.info as CloudinaryUploadWidgetInfo | string;
          // const value =
          //   typeof info === 'string'
          //     ? info
          //     : (info?.public_id ?? info?.secure_url ?? '');

          const url =
            typeof info === 'string'
              ? info
              : (info?.secure_url ?? info?.url ?? '');

          if (url) {
            handleUpload(url);
          } else {
            unlockPageScroll();
          }
        }}
        onError={() => {
          unlockPageScroll();
        }}
        onClose={() => {
          unlockPageScroll();
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open?.()}
            className="relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-4 text-neutral-600 transition hover:opacity-80"
          >
            <AiOutlineCloudUpload size={28} />
            <span className="text-center text-sm">
              Завантажити {multiple ? 'фото' : 'лого'}
            </span>
          </button>
        )}
      </CldUploadWidget>

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
                  label="✕"
                  uiVariant="ghost"
                  radius={999}
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(img);
                  }}
                  className="absolute top-1.5 right-1.5 z-20 flex h-6 w-6 min-w-0 items-center justify-center bg-white/85 p-0 text-neutral-700 hover:bg-white hover:text-red-600"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {error ? <p className="mt-1 text-sm text-red-500">{error}</p> : null}
    </div>
  );
};

export default ImageUploadCloudinary;
