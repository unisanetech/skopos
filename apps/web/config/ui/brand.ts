import {
  createSkoposLogoMarkSvg,
  createSkoposLogoMaskableSvg,
} from "../../src/features/brand/skopos-brand.ts";

export const unisaneBrandAssets = {
  name: "Skopos",
  logoMarkSvg: createSkoposLogoMarkSvg(),
  maskableLogoSvg: createSkoposLogoMaskableSvg(),
} as const;
