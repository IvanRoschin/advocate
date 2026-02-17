/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from 'next/og';

import { baseUrl } from '@/app/config/routes';
import { person } from '@/resources/content';

export const runtime = 'nodejs';

// В Next.js важно: request-dependent данные берём синхронно из request.url
export async function GET(request: Request) {
  const url = new URL(request.url);

  const title = url.searchParams.get('title') ?? person.name;
  const subtitle = url.searchParams.get('subtitle') ?? person.role;
  const tag = url.searchParams.get('tag') ?? ''; // например "Блог" / "Послуги"

  // Для <img> в OG renderer нужен абсолютный URL
  const avatarUrl = person.avatar.startsWith('http')
    ? person.avatar
    : `${baseUrl}${person.avatar.startsWith('/') ? '' : '/'}${person.avatar}`;

  // ---- Минимальный вариант шрифта (без внешних fetch) ----
  // ImageResponse и без fonts работает (будет системный шрифт).
  // Ниже "правильный фикс" добавит локальный шрифт.

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: '64px',
        background: 'linear-gradient(180deg, #0B0B0F 0%, #15151D 100%)',
        color: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '48px',
          width: '100%',
        }}
      >
        {/* Верхний бейдж */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: 0.9,
            fontSize: 28,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <div
            style={{
              width: 8,
              height: 32,
              borderRadius: 999,
              background: '#F2B233', // accent
            }}
          />
          <span>{tag || 'ADVOCATE'}</span>
        </div>

        {/* Заголовок */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              fontWeight: 800,
              overflow: 'hidden',
              textWrap: 'balance',
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 34,
              lineHeight: 1.2,
              opacity: 0.75,
              textWrap: 'balance',
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Низ: аватар + имя */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <img
            src={avatarUrl}
            alt={person.name}
            width={128}
            height={128}
            style={{
              width: 128,
              height: 128,
              borderRadius: 999,
              objectFit: 'cover',
              border: '3px solid rgba(242,178,51,0.75)',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1 }}>
              {person.name}
            </div>
            <div style={{ fontSize: 26, opacity: 0.7 }}>{person.role}</div>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ fontSize: 22, opacity: 0.55 }}>
            {baseUrl.replace(/^https?:\/\//, '')}
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1280,
      height: 720,
    }
  );
}
