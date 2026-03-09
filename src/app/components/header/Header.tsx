// Header.tsx
import { DesktopHeader } from './DesktopHeader';
import { MobileHeader } from './MobileHeader';

const Header = () => {
  return (
    <>
      <div className="xl:hidden">
        <div className="mx-auto w-full max-w-6xl px-3">
          <MobileHeader />
        </div>
      </div>
      <DesktopHeader />
    </>
  );
};

export default Header;
