'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';

import Btn from '@/app/components/ui/button/Btn';
import { iconLibrary } from '@/app/resources';

export function ShareSection({ title, url }: { title: string; url: string }) {
  const encoded = useMemo(
    () => ({
      url: encodeURIComponent(url),
      text: encodeURIComponent(title),
    }),
    [title, url]
  );

  const IconLink = iconLibrary.openLink;
  const IconTelegram = iconLibrary.telegram;
  const IconFacebook = iconLibrary.facebook;
  const IconX = iconLibrary.x;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Посилання скопійовано ✅');
    } catch {
      toast.error('Не вдалося скопіювати посилання');
    }
  };

  return (
    <section className="mt-10 rounded-xl border p-4">
      <div className="text-accent mb-3 text-sm font-semibold">Поділитися</div>

      <div className="flex flex-wrap gap-2">
        <Btn
          type="button"
          uiVariant="ghost"
          radius={12}
          onClick={onCopy}
          label="Скопіювати"
          icon={IconLink}
        />

        <a
          className="inline-flex"
          href={`https://t.me/share/url?url=${encoded.url}&text=${encoded.text}`}
          target="_blank"
          rel="noreferrer"
        >
          <Btn
            type="button"
            uiVariant="ghost"
            radius={12}
            label="Telegram"
            icon={IconTelegram}
          />
        </a>

        <a
          className="inline-flex"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encoded.url}`}
          target="_blank"
          rel="noreferrer"
        >
          <Btn
            type="button"
            uiVariant="ghost"
            radius={12}
            label="Facebook"
            icon={IconFacebook}
          />
        </a>

        <a
          className="inline-flex"
          href={`https://twitter.com/intent/tweet?url=${encoded.url}&text=${encoded.text}`}
          target="_blank"
          rel="noreferrer"
        >
          <Btn
            type="button"
            uiVariant="ghost"
            radius={12}
            label="X"
            icon={IconX}
          />
        </a>
      </div>
    </section>
  );
}
