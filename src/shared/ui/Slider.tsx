/** Labelled range input with a secondary value on the other side (e.g. "Rate 4.5%" … "Total interest ₪12,000"). */
export function Slider({ label, aside, min, max, step, value, onChange }: {
  label: string; aside: string; min: number; max: number; step: number; value: number; onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex flex-wrap justify-between gap-2 text-[15px]"><span className="font-semibold">{label}</span><span className="text-muted">{aside}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 block w-full" />
    </label>
  );
}
