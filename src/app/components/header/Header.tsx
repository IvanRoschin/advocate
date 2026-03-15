import { DesktopHeader } from './DesktopHeader';
import { MobileHeader } from './MobileHeader';

import type { NavScope } from './nav.shared';

type HeaderProps = {
  scope?: NavScope;
  showTime?: boolean;
  timeZone?: string;
  showThemeToggle?: boolean;
  showCta?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
};

const Header = ({
  scope = 'public',
  showTime = false,
  timeZone = 'Europe/Kyiv',
  showThemeToggle = true,
  showCta = true,
  ctaHref,
  ctaLabel,
}: HeaderProps) => {
  return (
    <>
      <div className="xl:hidden">
        <div className="mx-auto w-full max-w-6xl px-3">
          <MobileHeader
            scope={scope}
            showTime={showTime}
            timeZone={timeZone}
            showThemeToggle={showThemeToggle}
          />
        </div>
      </div>

      <DesktopHeader
        scope={scope}
        showTime={showTime}
        timeZone={timeZone}
        showThemeToggle={showThemeToggle}
        showCta={showCta}
        ctaHref={ctaHref}
        ctaLabel={ctaLabel}
      />
    </>
  );
};

export default Header;
