export const DEFAULT_BRAND_COLORS = {
  primary: "#226CE0",
  sidebar: "#172554",
};

function normalizeHex(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(value || "") ? value.toUpperCase() : fallback;
}

function foregroundFor(hex) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16));
  const luminance =
    (channels[0] * 299 + channels[1] * 587 + channels[2] * 114) / 1000;
  return luminance > 160 ? "#172033" : "#FFFFFF";
}

export function applyBrandTheme(profile) {
  const root = document.documentElement;
  const primary = normalizeHex(
    profile?.primary_color,
    DEFAULT_BRAND_COLORS.primary,
  );
  const sidebar = normalizeHex(
    profile?.sidebar_color,
    DEFAULT_BRAND_COLORS.sidebar,
  );

  root.style.setProperty("--primary", primary);
  root.style.setProperty("--primary-foreground", foregroundFor(primary));
  root.style.setProperty("--ring", primary);
  root.style.setProperty("--sidebar", sidebar);
  root.style.setProperty("--sidebar-foreground", foregroundFor(sidebar));
  root.style.setProperty("--sidebar-primary", primary);
  root.style.setProperty(
    "--sidebar-primary-foreground",
    foregroundFor(primary),
  );
  root.style.setProperty(
    "--sidebar-accent",
    `color-mix(in srgb, ${sidebar} 82%, white)`,
  );
  root.style.setProperty("--sidebar-accent-foreground", foregroundFor(sidebar));
  root.style.setProperty("--sidebar-ring", primary);
}
