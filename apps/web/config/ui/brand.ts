import {
  createSkoposLogoMarkSvg,
  createSkoposLogoMaskableSvg,
} from "../../src/features/brand/skopos-brand.ts";

export const skoposBrandAssets = {
  name: "Skopos",
  logoMarkSvg: createSkoposLogoMarkSvg(),
  maskableLogoSvg: createSkoposLogoMaskableSvg(),
} as const;
