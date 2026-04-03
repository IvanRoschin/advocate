'use client';

type Props = {
  href?: string;
  label?: string;
};

export default function WfpButton({
  href = 'https://secure.wayforpay.com/button/b42b7f2c2e946',
  label = 'Оплатити',
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-13.5 w-[256px] items-center rounded-[14px] bg-[#2B3160] px-4 text-left text-white shadow-md transition-opacity hover:opacity-80"
      style={{
        backgroundImage:
          "url('https://wfpstorage.s3.eu-west-1.amazonaws.com/button/bg5x2.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center right',
        backgroundSize: 'cover',
      }}
    >
      <span className="text-sm font-semibold">{label}</span>
    </a>
  );
}
