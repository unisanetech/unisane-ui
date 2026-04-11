import { CHROMA_SCALE, TONAL_LIGHTNESS } from "./constants.mjs";

export function oklchToHex(l, c, h) {
  const hRad = (h * Math.PI) / 180;

  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  const gamma = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);

  r = Math.round(Math.max(0, Math.min(1, gamma(r))) * 255);
  g = Math.round(Math.max(0, Math.min(1, gamma(g))) * 255);
  bl = Math.round(Math.max(0, Math.min(1, gamma(bl))) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

export function generateTonalPalette(hue, baseChroma) {
  const palette = {};

  for (const [tone, lightness] of Object.entries(TONAL_LIGHTNESS)) {
    const chromaMultiplier = CHROMA_SCALE[tone];
    const chroma = baseChroma * chromaMultiplier;
    palette[tone] = oklchToHex(lightness, chroma, hue);
  }

  return palette;
}

export function generateNeutralPalette(primaryHue, tintAmount = 0.012) {
  const palette = {};

  for (const [tone, lightness] of Object.entries(TONAL_LIGHTNESS)) {
    const chroma = tintAmount * CHROMA_SCALE[tone];
    palette[tone] = oklchToHex(lightness, chroma, primaryHue);
  }

  return palette;
}

export function generatePalettes(config) {
  const primaryHue = config.primary.hue;
  const primaryChroma = config.primary.chroma;

  const secondaryChroma = primaryChroma * (config.secondary?.chromaScale ?? 0.45);
  const secondaryHue = primaryHue + (config.secondary?.hueShift ?? 12);

  const tertiaryHue = (primaryHue + (config.tertiary?.hueShift ?? 60)) % 360;
  const tertiaryChroma = primaryChroma * (config.tertiary?.chromaScale ?? 0.7);

  const neutralTint = config.neutral?.tintFromPrimary ?? 0.012;

  const errorHue = config.error?.hue ?? 25;
  const errorChroma = config.error?.chroma ?? 0.18;
  const successHue = config.success?.hue ?? 145;
  const successChroma = config.success?.chroma ?? 0.18;
  const warningHue = config.warning?.hue ?? 85;
  const warningChroma = config.warning?.chroma ?? 0.16;
  const infoHue = config.info?.hue ?? 245;
  const infoChroma = config.info?.chroma ?? 0.16;

  return {
    primary: generateTonalPalette(primaryHue, primaryChroma),
    secondary: generateTonalPalette(secondaryHue, secondaryChroma),
    tertiary: generateTonalPalette(tertiaryHue, tertiaryChroma),
    neutral: generateNeutralPalette(primaryHue, neutralTint),
    "neutral-variant": generateNeutralPalette(primaryHue, neutralTint * 1.5),
    error: generateTonalPalette(errorHue, errorChroma),
    success: generateTonalPalette(successHue, successChroma),
    warning: generateTonalPalette(warningHue, warningChroma),
    info: generateTonalPalette(infoHue, infoChroma),
  };
}
