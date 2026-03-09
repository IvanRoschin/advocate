import AdvantageCounter from './AdvantageCounter';

type Props = {
  value: number;
  suffix?: string;
  text: string;
};

export default function AdvantageItem({ value, suffix, text }: Props) {
  return (
    <div className="bg-advantages-card border-advantages-card group hover:border-accent relative flex flex-col items-center justify-center rounded-2xl border p-6 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-2">
      <AdvantageCounter value={value} suffix={suffix} />

      <span className="bg-accent absolute bottom-4 h-0.5 w-8 transition-all duration-500 group-hover:w-20" />

      <span className="text-advantages-muted mt-3 text-sm md:text-base">
        {text}
      </span>
    </div>
  );
}
