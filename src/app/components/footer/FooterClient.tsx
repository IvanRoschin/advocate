'use client';

import { getRouteUrl } from '@/app/config/routes';
import { useThemeStore } from '@/app/store/theme.store';
import { CategoryResponseDTO } from '@/app/types';
import { AppLink, Logo } from '@/components';
import { footerSection, iconLibrary, person, social } from '@/resources';

type Props = {
  categories: CategoryResponseDTO[];
};

export default function FooterClient({ categories }: Props) {
  const theme = useThemeStore(state => state.theme);

  const logoVariant = theme === 'dark' ? 'dark' : 'light';

  const PhoneIcon = iconLibrary.phone;
  const EmailIcon = iconLibrary.envelope;

  const phoneLinks = social
    .filter(s => s.icon === 'phone' && Boolean(s.link))
    .map(s => s.link)
    .filter(
      (href): href is string =>
        typeof href === 'string' && href.startsWith('tel:')
    );

  const emailLink =
    social.find(s => s.icon === 'email' && Boolean(s.link))?.link ??
    (person.email ? `mailto:${person.email}` : null);

  return (
    <footer className="bg-footer text-footer">
      <div className="container mx-auto p-12 px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Logo variant={logoVariant} />
            <p className="text-footer-muted text-xs leading-relaxed">
              {footerSection.brand.text}
            </p>
          </div>

          <nav
            className="space-y-4"
            aria-label={footerSection.columns.practices.title}
          >
            <h3 className="footer-title nav">
              {footerSection.columns.practices.title}
            </h3>

            <ul className="text-footer-muted space-y-2 text-sm">
              {categories.length > 0 ? (
                categories.map(category => (
                  <li key={category._id}>
                    <AppLink
                      className="footer-link"
                      href={`/blog?category=${encodeURIComponent(category.slug)}`}
                    >
                      {category.title}
                    </AppLink>
                  </li>
                ))
              ) : (
                <li className="text-footer-muted">
                  Категорії наразі недоступні
                </li>
              )}
            </ul>
          </nav>

          <nav
            className="space-y-4"
            aria-label={footerSection.columns.quickLinks.title}
          >
            <h3 className="footer-title nav">
              {footerSection.columns.quickLinks.title}
            </h3>
            <ul className="text-footer-muted space-y-2 text-sm">
              {footerSection.columns.quickLinks.items.map(item => (
                <li key={item.id}>
                  <AppLink
                    className="footer-link"
                    href={getRouteUrl(item.route)}
                  >
                    {item.title}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <address className="space-y-4 not-italic">
            <h3 className="footer-title nav">
              {footerSection.columns.contacts.title}
            </h3>

            <ul className="text-footer-muted space-y-2 text-sm">
              <li>
                <div className="flex flex-col gap-2">
                  {phoneLinks.map(href => (
                    <AppLink
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link flex items-center"
                    >
                      <PhoneIcon className="mr-3 h-5 w-5" />
                      <span className="nav">{href.replace(/^tel:/, '')}</span>
                    </AppLink>
                  ))}
                </div>
              </li>

              {emailLink && (
                <li>
                  <AppLink
                    href={emailLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link flex items-center"
                  >
                    <EmailIcon className="mr-3 h-5 w-5" />
                    <span className="nav">{person.email}</span>
                  </AppLink>
                </li>
              )}

              <li>{footerSection.columns.contacts.locationLabel}</li>
            </ul>
          </address>
        </div>

        <div className="border-footer text-footer-bottom mt-12 border-t pt-6 text-center text-xs">
          © {new Date().getFullYear()} {footerSection.bottom.rights}
        </div>
      </div>
    </footer>
  );
}
