import { ICON_PATHS, type IconName } from "./icon-data";

export type { IconName };

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  // Provide a label to expose the icon to assistive tech; omitted => decorative.
  label?: string;
};

// Renders a Material Symbols Rounded glyph as inline SVG (currentColor fill).
export function Icon({ name, size = 20, className, label }: IconProps) {
  const inner = ICON_PATHS[name];
  return (
    <svg
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}
