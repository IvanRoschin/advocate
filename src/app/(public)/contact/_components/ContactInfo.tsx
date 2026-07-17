import Link from 'next/link';

import { eyebrowClassName } from './contact.styles';

type Props = {
  phone: string;
  email: string;
  address: string;
  city: string;
};

const ContactInfo = ({ phone, email, address, city }: Props) => {
  const items = [
    {
      label: 'Телефон',
      value: phone,
      href: `tel:${phone.replaceAll(' ', '')}`,
    },
    { label: 'Email', value: email, href: `mailto:${email}` },
    { label: 'Адреса', value: `${address}, ${city}`, href: undefined },
  ];

  return (
    <section className="container pb-10">
      <div className="grid divide-y border-t border-b md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map(item => (
          <div
            key={item.label}
            className="px-1 py-6 md:px-6 md:first:pl-0 md:last:pr-0"
          >
            <p className={eyebrowClassName}>{item.label}</p>
            {item.href ? (
              <Link
                href={item.href}
                className="text-accent mt-3 block text-lg font-medium underline-offset-4 hover:underline"
              >
                {item.value}
              </Link>
            ) : (
              <p className="text-app mt-3 text-lg font-medium">{item.value}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactInfo;
