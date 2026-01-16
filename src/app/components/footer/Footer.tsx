'use client';

import Link from 'next/link';
import { FaEnvelope } from 'react-icons/fa';
import { FaSquarePhone } from 'react-icons/fa6';

import Logo from '../logo/Logo';

const Footer = () => {
  const phone1 = process.env.NEXT_PUBLIC_ADVOCATE_PN_1 ?? null;
  const phone2 = process.env.NEXT_PUBLIC_ADVOCATE_PN_2 ?? null;
  const email = process.env.NEXT_PUBLIC_ADVOCATE_EMAIL ?? null;

  return (
    <footer className="fg-app text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Logo />
            <p className="text-xs leading-relaxed text-white/80">
              Я вірю у Ваш успіх і готовий підтримати Вашу позицію правовими
              аргументами.
            </p>
          </div>

          {/* Practices */}
          <nav className="space-y-4">
            <h3 className="footer-title nav">Мої практики</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="footer-link">Сімейне право</li>
              <li className="footer-link">Кримінальне право</li>
              <li className="footer-link">Цивільні спори</li>
            </ul>
          </nav>

          {/* Quick links */}
          <nav className="space-y-4">
            <h3 className="footer-title nav">Швидкі посилання</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="footer-link">Про мене</li>
              <li className="footer-link">Послуги</li>
              <li className="footer-link">Контакти</li>
            </ul>
          </nav>

          {/* Contacts */}
          <address className="space-y-4 not-italic">
            <h3 className="footer-title nav">Мої контакти</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <div className="flex flex-col gap-2">
                  {phone1 && (
                    <Link
                      href={`tel:${phone1}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <FaSquarePhone className="mr-3 h-5 w-5" />
                      <span className="nav">{phone1}</span>
                    </Link>
                  )}
                  {phone2 && (
                    <Link
                      href={`tel:${phone2}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <FaSquarePhone className="mr-3 h-5 w-5" />
                      <span className="nav">{phone2}</span>
                    </Link>
                  )}
                </div>
              </li>{' '}
              <li>
                <Link
                  href={`mailto:${email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <FaEnvelope className="mr-3 h-5 w-5" />
                  <span className="nav">{email}</span>
                </Link>
              </li>{' '}
              <li>📍 Київ, Україна</li>
            </ul>
          </address>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Всі права захищені
        </div>
      </div>
    </footer>
  );
};

export default Footer;
