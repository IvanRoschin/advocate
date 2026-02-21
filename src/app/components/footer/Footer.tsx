'use client';

import { getRouteUrl } from '@/app/config/routes';
import { AppLink, Logo } from '@/components';
import { footerSection, iconLibrary, person, social } from '@/resources';

const Footer = () => {
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
    <footer className="fg-app text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Logo />
            <p className="text-xs leading-relaxed text-white/80">
              {footerSection.brand.text}
            </p>
          </div>

          {/* Practices */}
          <nav
            className="space-y-4"
            aria-label={footerSection.columns.practices.title}
          >
            <h3 className="footer-title nav">
              {footerSection.columns.practices.title}
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              {footerSection.columns.practices.items.map(item => (
                <li key={item.id} className="footer-link">
                  {item.title}
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick links */}
          <nav
            className="space-y-4"
            aria-label={footerSection.columns.quickLinks.title}
          >
            <h3 className="footer-title nav">
              {footerSection.columns.quickLinks.title}
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
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

          {/* Contacts */}
          <address className="space-y-4 not-italic">
            <h3 className="footer-title nav">
              {footerSection.columns.contacts.title}
            </h3>

            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <div className="flex flex-col gap-2">
                  {phoneLinks.map(href => (
                    <AppLink
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
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
                    className="flex items-center"
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

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {footerSection.bottom.rights}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
