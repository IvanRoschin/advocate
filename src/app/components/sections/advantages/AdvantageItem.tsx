import AdvantageCounter from './AdvantageCounter';

type Props = {
  value: number;
  suffix?: string;
  text: string;
};

export default function AdvantageItem({ value, suffix, text }: Props) {
  return (
    <div className="group hover:border-accent relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 p-6 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-2">
      <AdvantageCounter value={value} suffix={suffix} />
      {/* underline */}
      <span className="bg-accent absolute bottom-4 h-0.5 w-8 transition-all duration-500 group-hover:w-20" />

      <span className="mt-3 text-sm text-gray-200 md:text-base">{text}</span>
    </div>
  );
}
