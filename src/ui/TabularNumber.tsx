/** Fredoka has proportional digits, so equal advance boxes provide stable counters without changing glyphs. */
export function TabularNumber({ value }: { value: number }) {
  return <b className="tabular-number"><span className="sr-only">{value}</span><span className="tabular-digits" aria-hidden="true">{String(value).split("").map((digit,index)=><span key={index}>{digit}</span>)}</span></b>;
}
