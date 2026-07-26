import { DesktopHeader } from './DesktopHeader';
import { MobileHeader } from './MobileHeader';

import type { NavScope } from './nav.shared';

export type HeaderPublicAuthState = {
  isAuthenticated: boolean;
  role?: string;
};

type HeaderClient = {
  scope?: NavScope;
  publicAuth?: HeaderPublicAuthState;
  showTime?: boolean;
  timeZone?: string;
  showThemeToggle?: boolean;
  showCta?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
};

const HeaderClient = async ({
  scope = 'public',
  publicAuth,
  showTime = false,
  timeZone = 'Europe/Kyiv',
  showThemeToggle = true,
  showCta = true,
  ctaHref,
  ctaLabel,
}: HeaderClient) => {
  // Нижній плаваючий pill-навбар розрахований на публічну навігацію
  // (NAV_ITEMS_BY_SCOPE.mobile завжди повертає пункти публічного сайту).
  // Для admin/client/manager-скоупів мобільну навігацію вже забезпечує
  // верхній гамбургер-меню (MobileMenu) з коректними пунктами свого скоупу,
  // тож дублювати її тут не потрібно — це лише плутало користувача і
  // показувало невірні посилання в кабінеті/адмінці.
  const showMobilePillNav = scope === 'public';

  return (
    <>
      {showMobilePillNav && (
        <div className="xl:hidden">
          <div className="mx-auto w-full max-w-6xl px-3">
            <MobileHeader
              scope="mobile"
              showTime={showTime}
              timeZone={timeZone}
              showThemeToggle={showThemeToggle}
              publicAuth={publicAuth}
            />
          </div>
        </div>
      )}

      <DesktopHeader
        scope={scope}
        showTime={showTime}
        timeZone={timeZone}
        showThemeToggle={showThemeToggle}
        showCta={showCta}
        ctaHref={ctaHref}
        ctaLabel={ctaLabel}
        publicAuth={publicAuth}
      />
    </>
  );
};

export default HeaderClient;
