'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaEnvelope, FaFacebookSquare } from 'react-icons/fa';
import { FaSquareInstagram, FaSquarePhone } from 'react-icons/fa6';

const Socials = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [phone1, setPhone1] = useState<string | null>(null);
  const [phone2, setPhone2] = useState<string | null>(null);
  const [facebook, setFacebook] = useState<string | null>(null);
  const [instagram, setInstagram] = useState<string | null>(null);

  useEffect(() => {
    setEmail(process.env.NEXT_PUBLIC_ADVOCATE_EMAIL || null);
    setPhone1(process.env.NEXT_PUBLIC_ADVOCATE_PN_1 || null);
    setPhone2(process.env.NEXT_PUBLIC_ADVOCATE_PN_2 || null);
    setFacebook(process.env.NEXT_PUBLIC_FACEBOOK_URL || null);
    setInstagram(process.env.NEXT_PUBLIC_INSTAGRAM_URL || null);
  }, []);

  return (
    <div className="hidden bg-black pb-3 text-white sm:block">
      <div className="container flex flex-col gap-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <ul className="flex flex-col gap-2">
          {email && (
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
            </li>
          )}
          {(phone1 || phone2) && (
            <li>
              <div className="flex gap-4">
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
            </li>
          )}
        </ul>

        <ul className="flex flex-col gap-2 sm:items-end">
          {facebook && (
            <li>
              <Link
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <span className="nav mr-3">Facebook</span>
                <FaFacebookSquare className="h-5 w-5" />
              </Link>
            </li>
          )}
          {instagram && (
            <li>
              <Link
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <span className="nav mr-3">Instagram</span>
                <FaSquareInstagram className="h-5 w-5" />
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Socials;
