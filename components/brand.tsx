// A plain document glyph with an "RT" monogram. Deliberately not the Docs
// product icon; this is the site's own mark.
export function DocMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M11 5h11.5L31 13.5V33a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        fill="#0B57D0"
      />
      <path d="M22.5 5 31 13.5h-7a1.5 1.5 0 0 1-1.5-1.5V5Z" fill="#3f7fe0" />
      <text
        x="20"
        y="27.5"
        textAnchor="middle"
        fontFamily="var(--font-chrome)"
        fontSize="13"
        fontWeight="700"
        fill="#ffffff"
        letterSpacing="0.5"
      >
        RT
      </text>
    </svg>
  );
}
