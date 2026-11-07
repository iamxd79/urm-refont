export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46.4" fill="none" stroke="#b0bfd6" strokeWidth="7.2" />
      <circle cx="50" cy="50" r="27.8" fill="none" stroke="#b0bfd6" strokeWidth="7.65" />
      <circle cx="50" cy="50" r="16.5" fill="#f1ebdd" />
    </svg>
  );
}
