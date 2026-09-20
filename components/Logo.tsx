import clsx from "clsx";

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 18c-4-2-9-9-14-8"
        stroke="#2f8f4e"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M32 18c4-2 9-9 14-8"
        stroke="#2f8f4e"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="32" cy="40" r="20" fill="#e8722c" stroke="#cf6323" strokeWidth="2" />
      <circle cx="32" cy="40" r="15" fill="#f0894a" />
      <text
        x="32"
        y="46"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontWeight="700"
        fontSize="18"
        fill="#fff2e2"
      >
        K
      </text>
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <Logo size={32} />
      <span className="font-display text-2xl font-semibold text-sunga-green">Sunga</span>
    </div>
  );
}
