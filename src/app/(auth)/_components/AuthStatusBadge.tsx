type Props = {
  label: string;
  tone?: 'accent' | 'success' | 'neutral';
};

export default function AuthStatusBadge({ label, tone = 'accent' }: Props) {
  const toneClass =
    tone === 'success'
      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
      : tone === 'neutral'
        ? 'bg-foreground/8 text-foreground/80'
        : 'bg-accent/10 text-accent';

  return (
    <div
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${toneClass}`}
    >
      {label}
    </div>
  );
}
