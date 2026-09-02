import { DEFAULT_BRAND_COLORS } from "@/lib/brandTheme";

function color(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(value || "") ? value.toUpperCase() : fallback;
}

export function getPrintThemeCss(profile) {
  const primary = color(profile?.primary_color, DEFAULT_BRAND_COLORS.primary);
  const sidebar = color(profile?.sidebar_color, DEFAULT_BRAND_COLORS.sidebar);

  return `:root{--print-primary:${primary};--print-sidebar:${sidebar};--print-primary-soft:color-mix(in srgb,${primary} 9%,white);--print-primary-softer:color-mix(in srgb,${primary} 4%,white);--print-primary-border:color-mix(in srgb,${primary} 28%,white);--print-sidebar-muted:color-mix(in srgb,${sidebar} 68%,white);--print-accent:color-mix(in srgb,${primary} 72%,${sidebar})}`;
}
